import { World } from "@javelin/ecs"
import { Clock } from "@javelin/hrtime-loop"
import { Settings, sheepQuery } from "../components"

export const sys_sheep_neighboring = (
  boidSettings: Settings,
  world: World<Clock>
) => {
  sheepQuery((e, [sheep, pos]) => {
    const neighbors: number[] = []
    sheepQuery((neighborId, [, neighborPos]) => {
      if (
        (neighborPos.x - pos.x) ** 2 + (neighborPos.y - pos.y) ** 2 <
        boidSettings.neighboringRadius ** 2
      ) {
        neighbors.push(neighborId)
      }
    })
    sheep.neighbors = neighbors
  })
}
