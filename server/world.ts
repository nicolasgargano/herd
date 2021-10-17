import {
  createWorld,
  useMonitor,
  World
} from "@javelin/ecs"
import {State} from "../shared/state"
import * as schema from "../shared/schema"
import {Clock} from "@javelin/hrtime-loop"
import {settings, dogsQuery, sheepQuery} from "./ecs/components"
import {sys_movement} from "./ecs/sys_movement"
import {sys_clamp_sheep_speed} from "./ecs/sys_clamp_sheep_speed"
import {sys_reset_sheep_acceleration} from "./ecs/sys_reset_sheep_acceleration"
import {sys_spawn_sheep} from "./ecs/sys_spawn_sheep"
import {sys_test_wrap_sheep} from "./ecs/sys_test_wrap_sheep"
import {sys_sheep_dog_evasion} from "./ecs/sys_sheep_dog_evasion"
import {PlayerInput} from "../shared/input"
import {sys_player_input} from "./ecs/sys_player_input"
import {sys_movement_slow_down} from "./ecs/sys_movement_slow_down"
import { sys_sheep_separation } from "./ecs/sys_sheep_separation"
import {sys_sheep_neighboring} from "./ecs/sys_sheep_neighboring"
import {sys_alignment} from "./ecs/sys_alignment"
import {sys_sheep_grouping} from "./ecs/sys_sheep_grouping"
import {sys_movement_clamp} from "./ecs/sys_movement_clamp"
import {sys_scoring} from "./ecs/sys_scoring"

export const setupWorld = (state: State, inputMap: Map<string, PlayerInput>) => {
  const sys_sync_state = (world: World<Clock>) => {
    // TODO eslint is picking this up because of the "use" prefix
    //   can I enable that rule only for the web directory?
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useMonitor(sheepQuery, (e, [, vec2]) => {
      console.log("Adding sheep to state!")
      state.sheepMap.set(e.toString(), new schema.Sheep(vec2.x, vec2.y))
    })

    sheepQuery((e, [sheepTag, vec2]) => {
      const sheep = state.sheepMap.get(e.toString())
      if (sheep) {
        sheep.x = vec2.x
        sheep.y = vec2.y
      }
    })

    // TODO eslint is picking this up because of the "use" prefix
    //   can I enable that rule only for the web directory?
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useMonitor(dogsQuery, (e, [, vec2]) => {
      console.log("Adding dog to state!")
      state.dogsMap.set(e.toString(), new schema.Dog(vec2.x, vec2.y))
    })

    dogsQuery((e, [dogTag, vec2]) => {
      const dog = state.dogsMap.get(e.toString())
      if (dog) {
        dog.x = vec2.x
        dog.y = vec2.y
      }
    })
  }

  const world = createWorld<Clock>({
    systems: [
      sys_reset_sheep_acceleration,
      world => sys_sheep_neighboring(settings, world),
      world => sys_alignment(settings, world),
      world => sys_sheep_grouping(settings, world),
      world => sys_player_input(settings, inputMap, world),
      world => sys_clamp_sheep_speed(settings, world),
      world => sys_sheep_dog_evasion(settings, world),
      world => sys_sheep_separation(settings, world),
      sys_movement,
      world => sys_scoring(settings, state, world),
      sys_movement_slow_down,
      sys_spawn_sheep,
      world => sys_movement_clamp(settings, world),
      sys_sync_state
    ],
  })

  return world
}

