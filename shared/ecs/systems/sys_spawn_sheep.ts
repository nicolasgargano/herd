import { component, toComponent, useInit, World } from "@javelin/ecs"
import { Clock } from "@javelin/hrtime-loop"
import { Vector2 } from "three"
import {
  settings,
  Settings,
  Movement,
  Position,
  Sheep,
  Vec2
} from "../components"
import Prando from "prando"
import { nonEmptyArray } from "fp-ts"

export const sys_spawn_sheep = (world: World<Clock>) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const needsInit = useInit()
  if (needsInit) {
    generateRandomStartingConditions(0, 17, settings).forEach(([pos, vel]) => {
      world.create(
        component(Sheep),
        toComponent(new Vector2(pos.x, pos.y), Position),
        component(Movement, {
          velocity: toComponent(new Vector2(vel.x, vel.y), Vec2),
          acceleration: toComponent(new Vector2(0, 0), Vec2)
        })
      )
    })
  }
}

export const generateRandomStartingConditions = (
  seed: number,
  worldSize: number,
  settings: Settings
): [Vector2, Vector2][] => {
  const rng = new Prando(seed)
  return nonEmptyArray.range(1, settings.amountOfSheep).map(_ => {
    const x = rng.next(-worldSize / 3, worldSize / 3)
    const y = rng.next(-worldSize / 3, worldSize / 3)
    const pos = new Vector2(x, y)

    const vx = rng.next(-1, 1)
    const vy = rng.next(-1, 1)
    const speed = rng.next(settings.minSpeed, settings.maxSpeed)
    const vel = new Vector2(vx, vy).normalize().multiplyScalar(speed)

    return [pos, vel]
  })
}
