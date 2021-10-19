import { World } from "@javelin/ecs"
import { Settings, sheepQuery } from "../components"
import { Vector2 } from "three"
import { State } from "../../state"
import { TickData } from "../world"

export const sys_scoring = (
  settings: Settings,
  state: State,
  world: World<TickData>
) => {
  sheepQuery((e, [, position]) => {
    if (state.gamestate === "playing") {
      const pos = position as Vector2
      const dt = world.latestTickData.dt
      const limitHalfExtent =
        settings.worldHalfExtents[0] - settings.scoringAreaWidth

      if (pos.x > limitHalfExtent) state.redTeam.points += dt
      else if (pos.x < -limitHalfExtent) state.blueTeam.points += dt

      if (state.redTeam.points > settings.pointsToWin)
        state.redTeam.points = settings.pointsToWin
      if (state.blueTeam.points > settings.pointsToWin)
        state.blueTeam.points = settings.pointsToWin
    }
  })
}
