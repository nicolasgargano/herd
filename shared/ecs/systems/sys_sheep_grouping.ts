import { World } from "@javelin/ecs"
import { Clock } from "@javelin/hrtime-loop"
import { Vector2 } from "three"
import { Settings, Position, sheepMovementQuery } from "../components"
import { TickData } from "../world"

export const sys_sheep_grouping = (
  boidSettings: Settings,
  world: World<TickData>
) => {
  sheepMovementQuery((e, [sheep, pos, movement]) => {
    if (sheep.neighbors.length > 0) {
      const accumulatedHerdPosition = new Vector2(0, 0)

      for (const neighborId of sheep.neighbors) {
        const neighborPosition = world.tryGet(neighborId, Position)
        if (neighborPosition)
          accumulatedHerdPosition.add(neighborPosition as Vector2)
      }

      const averageHerdPosition = accumulatedHerdPosition.divideScalar(
        sheep.neighbors.length
      )

      const toAverage = averageHerdPosition
        .sub(pos as Vector2)
        .setLength(boidSettings.maxSpeed)

      const steerForce = toAverage
        .sub(movement.velocity as Vector2)
        .clampLength(0, boidSettings.maxSteerForce)

      const weightedSteerForce = steerForce.multiplyScalar(
        boidSettings.groupingWeight
      )
      ;(movement.acceleration as Vector2).add(weightedSteerForce)
    }
  })
}
