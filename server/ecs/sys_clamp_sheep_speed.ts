import { World } from "@javelin/ecs"
import { Clock } from "@javelin/hrtime-loop"
import { Vector2 } from "three"
import { Settings, sheepMovementQuery } from "./components"

export const sys_clamp_sheep_speed = (
  settings: Settings,
  world: World<Clock>
) => {
  sheepMovementQuery((e, [sheep, position, movement]) => {
    if (sheep.running) {
      ;(movement.velocity as Vector2).clampLength(
        settings.minSpeed,
        settings.maxSpeed
      )
    }
  })
}
