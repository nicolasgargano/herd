import {World} from "@javelin/ecs"
import {Clock} from "@javelin/hrtime-loop"
import {movementQuery} from "./components"

export const sys_movement = (world: World<Clock>) => {
  const dt = world.latestTickData.dt / 1000
  movementQuery((e, [position, {velocity, acceleration}]) => {
    position.x += velocity.x * dt
    position.y += velocity.y * dt
    velocity.x += acceleration.x * dt
    velocity.y += acceleration.y * dt
  })
}