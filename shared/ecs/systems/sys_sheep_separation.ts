import { World } from "@javelin/ecs"
import { Clock } from "@javelin/hrtime-loop"
import { Vector2 } from "three"
import { Settings, Position, sheepMovementQuery } from "../components"
import { TickData } from "../world"

export const sys_sheep_separation = (
  boidSettings: Settings,
  world: World<TickData>
) => {
  sheepMovementQuery((sheepId, [sheep, pos, movement]) => {
    if (sheep.neighbors.length > 0) {
      const accumulatedDistancing = new Vector2(0, 0)

      for (const neighborId of sheep.neighbors) {
        const neighborPosition = world.tryGet(neighborId, Position)
        if (neighborPosition) {
          const neighborToThis = (pos as Vector2)
            .clone()
            .sub(neighborPosition as Vector2)

          const inverselyProportional = neighborToThis.divideScalar(
            Math.pow(neighborToThis.length(), 2) || 0.00001
          )

          accumulatedDistancing.add(inverselyProportional)
        }
      }

      const averageDistancing = accumulatedDistancing.divideScalar(
        sheep.neighbors.length
      )

      const steerForce = averageDistancing
        .setLength(boidSettings.maxSpeed)
        .sub(movement.velocity as Vector2)
        .clampLength(0, boidSettings.maxSteerForce)

      const weightedSteerForce = steerForce.multiplyScalar(
        boidSettings.separationWeight
      )
      ;(movement.acceleration as Vector2).add(weightedSteerForce)
    }
  })
}
