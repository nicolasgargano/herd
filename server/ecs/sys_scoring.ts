import {World} from "@javelin/ecs"
import {Clock} from "@javelin/hrtime-loop"
import {Settings, sheepQuery} from "./components"
import {Vector2} from "three"
import {State} from "../../shared/state"

export const sys_scoring = (settings: Settings, state: State, world: World<Clock>) => {
  sheepQuery((e, [, position]) => {
    const pos = position as Vector2
    const dt = world.latestTickData.dt / 1000
    const limitHalfExtent = settings.worldHalfExtents[1] - settings.scoringAreaHeight

    if (pos.y > limitHalfExtent) {
      state.topTeam.points += dt
    } else if (pos.y < -limitHalfExtent) {
      state.bottomTeam.points += dt
    }

  })
}