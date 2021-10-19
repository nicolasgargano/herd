import { World } from "@javelin/ecs"
import { Settings, sheepQuery } from "../components"
import { TickData } from "../world"

export const sys_sheep_neighboring = (
  boidSettings: Settings,
  world: World<TickData>
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
