import { World } from "@javelin/ecs"
import { Clock } from "@javelin/hrtime-loop"
import { Vector2 } from "three"
import { sheepMovementQuery } from "../components"
import { TickData } from "../world"

const zero = new Vector2(0, 0)

export const sys_reset_sheep_acceleration = (world: World<TickData>) => {
  sheepMovementQuery((e, [sheep, pos, movement]) => {
    ;(movement.acceleration as Vector2).copy(zero)
  })
}
