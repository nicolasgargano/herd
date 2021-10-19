import { useMonitor, World } from "@javelin/ecs"
import { Clock } from "@javelin/hrtime-loop"
import { State } from "../../state"
import { dogsQuery, sheepQuery } from "../components"
import * as schema from "../../schema"
import { TickData } from "../world"

export const sys_sync_state = (world: World<TickData>, state: State) => {
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

  // TODO eslint is picking this up because of the "use" prefix
  //   can I enable that rule only for the web directory?
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useMonitor(sheepQuery, (e, [, vec2]) => {
    console.log("Adding sheep to state!")
    state.sheepMap.set(e.toString(), new schema.Sheep(vec2.x, vec2.y))
  })
}
