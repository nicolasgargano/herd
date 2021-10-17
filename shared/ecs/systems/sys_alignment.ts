import { World } from "@javelin/ecs"
import { Clock } from "@javelin/hrtime-loop"
import { Vector2 } from "three"
import { Settings, Movement, sheepMovementQuery } from "../components"

export const sys_alignment = (boidSettings: Settings, world: World<Clock>) => {
  sheepMovementQuery((e, [sheep, pos, movement]) => {
    if (sheep.neighbors.length > 0) {
      const accumulatedHerdVelocity = new Vector2(0, 0)

      for (const neighborId of sheep.neighbors) {
        const neighborMovement = world.tryGet(neighborId, Movement)
        if (neighborMovement)
          accumulatedHerdVelocity.add(neighborMovement.velocity as Vector2)
      }

      const averageHerdVelocity = accumulatedHerdVelocity.divideScalar(
        sheep.neighbors.length
      )

      const steerForce = averageHerdVelocity
        .sub(movement.velocity as Vector2)
        .clampLength(0, boidSettings.maxSteerForce)

      const weightedSteerForce = steerForce.multiplyScalar(
        boidSettings.alignmentWeight
      )
      ;(movement.acceleration as Vector2).add(weightedSteerForce)
    }
  })
}
