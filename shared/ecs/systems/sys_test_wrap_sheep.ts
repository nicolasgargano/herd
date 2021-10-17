import { World } from "@javelin/ecs"
import { Clock } from "@javelin/hrtime-loop"
import { Vector2 } from "three"
import { sheepMovementQuery } from "../components"

export const sys_test_wrap_sheep = (world: World<Clock>) => {
  const size = 16
  sheepMovementQuery((e, [sheep, position, movement]) => {
    const pos = position as Vector2

    if (pos.x < -size) pos.setX(size)
    else if (pos.x > size) pos.setX(-size)

    if (pos.y < -size) pos.setY(size)
    else if (pos.y > size) pos.setY(-size)
  })
}
