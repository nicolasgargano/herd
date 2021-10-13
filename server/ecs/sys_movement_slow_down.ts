import {World} from "@javelin/ecs"
import {Clock} from "@javelin/hrtime-loop"
import {movementQuery, sheepMovementQuery} from "./components"
import {Vector2} from "three"

const decrement = 0.3
const helperV2 = new Vector2(0, 0)
const zero = new Vector2(0, 0)

export const sys_movement_slow_down = (world: World<Clock>) => {
  sheepMovementQuery((e, [sheep, position, {velocity, acceleration}]) => {
    if (!sheep.running) return
    const sheepVelocity = velocity as Vector2
    helperV2.copy(sheepVelocity).normalize().multiplyScalar(decrement)
    if (sheepVelocity.lengthSq() > helperV2.lengthSq()) {
      sheepVelocity.sub(helperV2)
    } else {
      sheepVelocity.copy(zero)
    }
  })
}