import { createWorld, useMonitor, World } from "@javelin/ecs"
import { State } from "../state"
import * as schema from "../schema"
import { Clock } from "@javelin/hrtime-loop"
import { settings, dogsQuery, sheepQuery } from "./components"
import { sys_movement } from "./systems/sys_movement"
import { sys_clamp_sheep_speed } from "./systems/sys_clamp_sheep_speed"
import { sys_reset_sheep_acceleration } from "./systems/sys_reset_sheep_acceleration"
import { sys_spawn_sheep } from "./systems/sys_spawn_sheep"
import { sys_sheep_dog_evasion } from "./systems/sys_sheep_dog_evasion"
import { PlayerInput } from "../input"
import { sys_player_input } from "./systems/sys_player_input"
import { sys_movement_slow_down } from "./systems/sys_movement_slow_down"
import { sys_sheep_separation } from "./systems/sys_sheep_separation"
import { sys_sheep_neighboring } from "./systems/sys_sheep_neighboring"
import { sys_alignment } from "./systems/sys_alignment"
import { sys_sheep_grouping } from "./systems/sys_sheep_grouping"
import { sys_movement_clamp } from "./systems/sys_movement_clamp"
import { sys_scoring } from "./systems/sys_scoring"
import { sys_sync_state } from "./systems/sys_sync_state"
import { sys_win } from "./systems/sys_win"

export type TickData = {
  dt: number
  tick: number
  time: number
}

export const setupWorld = (
  state: State,
  inputMap: Map<string, PlayerInput>
) => {
  const world = createWorld<TickData>({
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
      world => sys_win(settings, state, world),
      sys_movement_slow_down,
      sys_spawn_sheep,
      world => sys_movement_clamp(settings, world),
      world => sys_sync_state(world, state)
    ]
  })

  return world
}
