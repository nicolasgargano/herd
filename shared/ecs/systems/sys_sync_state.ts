import { useMonitor, World } from "@javelin/ecs"
import { Clock } from "@javelin/hrtime-loop"
import { State } from "../../state"
import { sheepQuery } from "../components"
import * as schema from "../../schema"
import { TickData } from "../world"

export const sys_sync_state = (world: World<TickData>, state: State) => {
  // TODO eslint is picking this up because of the "use" prefix
  //   can I enable that rule only for the web directory?
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useMonitor(sheepQuery, (e, [, vec2]) => {
    console.log("Adding sheep to state!")
    state.sheepMap.set(e.toString(), new schema.Sheep(vec2.x, vec2.y))
  })
}
