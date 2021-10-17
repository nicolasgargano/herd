import {
  Settings,
  dogsQuery,
  sheepQuery,
  sheepMovementQuery
} from "./components"
import { World } from "@javelin/ecs"
import { Clock } from "@javelin/hrtime-loop"
import { Vector2 } from "three"

export const sys_sheep_dog_evasion = (
  boidSettings: Settings,
  world: World<Clock>
) => {
  sheepMovementQuery((sheepId, [sheep, sheepPos, sheepMovement]) => {
    const accumulatedDogDistancing = new Vector2(0, 0)
    let dogs = 0

    dogsQuery((dogId, [, dogPos]) => {
      const dogToThis = (sheepPos as Vector2).clone().sub(dogPos as Vector2)
      if (dogToThis.lengthSq() < boidSettings.alertRadius ** 2) {
        dogs++
        const inverselyProportional = dogToThis.divideScalar(
          Math.max(Math.pow(dogToThis.length(), 2), 0.001)
        )
        accumulatedDogDistancing.add(inverselyProportional)
      }
    })

    if (accumulatedDogDistancing.length() === 0) {
      sheep.running = false
    } else {
      sheep.running = true

      const averageDogDistancing = accumulatedDogDistancing.divideScalar(dogs)

      const steerForce = averageDogDistancing
        .setLength(boidSettings.maxSpeed)
        .sub(sheepMovement.velocity as Vector2)
        .clampLength(0, boidSettings.maxSteerForce)

      const weightedSteerForce = steerForce.multiplyScalar(
        boidSettings.dogEvasionWeight
      )
      ;(sheepMovement.acceleration as Vector2).add(weightedSteerForce)
    }
  })
}
