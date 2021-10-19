import { World } from "@javelin/ecs"
import { Clock } from "@javelin/hrtime-loop"
import { movementQuery, Settings } from "../components"
import { Vector2 } from "three"
import { TickData } from "../world"

export const sys_movement_clamp = (
  settings: Settings,
  world: World<TickData>
) => {
  movementQuery((e, [position]) => {
    const pos = position as Vector2
    const [halfExtentX, halfExtentY] = settings.worldHalfExtents

    if (pos.x < -halfExtentX) pos.setX(-halfExtentX)
    else if (pos.x > halfExtentX) pos.setX(halfExtentX)

    if (pos.y < -halfExtentY) pos.setY(-halfExtentY)
    else if (pos.y > halfExtentY) pos.setY(halfExtentY)
  })
}
