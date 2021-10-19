import { World } from "@javelin/ecs"
import { Clock } from "@javelin/hrtime-loop"
import { Settings, sheepQuery } from "../components"
import { State } from "../../state"
import { TickData } from "../world"

export const sys_win = (
  settings: Settings,
  state: State,
  world: World<TickData>
) => {
  if (
    state.redTeam.points >= settings.pointsToWin ||
    state.blueTeam.points >= settings.pointsToWin
  )
    state.gamestate = "done"
}
