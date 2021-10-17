import { World } from "@javelin/ecs"
import { Clock } from "@javelin/hrtime-loop"
import { Vector2 } from "three"
import { sheepMovementQuery } from "../components"

const zero = new Vector2(0, 0)

export const sys_reset_sheep_acceleration = (world: World<Clock>) => {
  sheepMovementQuery((e, [sheep, pos, movement]) => {
    ;(movement.acceleration as Vector2).copy(zero)
  })
}
