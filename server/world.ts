import {component, createQuery, createWorld, registerSchema, useMonitor, World} from "@javelin/ecs"
import {State} from "../shared/state"
import * as javelin from "@javelin/ecs"
import {Sheep} from "../shared/sheep"
import {Clock} from "@javelin/hrtime-loop"

const Vec2 = { x: javelin.number, y: javelin.number }
const Tag_Sheep = {}
const Tag_Dog = {}
const PlayerControl = {playerId: javelin.string}

registerSchema(Vec2, 1)
registerSchema(Tag_Sheep, 2)
registerSchema(Tag_Dog, 3)
registerSchema(PlayerControl, 4)

const sheepQuery = createQuery(Tag_Sheep, Vec2)
const dogsQuery = createQuery(Tag_Dog, Vec2)

export const setupWorld = (state: State) => {
  const sys_test_sheepRunInCircles = (world: World<Clock>) => {
    const seconds = Number(world.latestTickData.now) / 1_000_000_000
    sheepQuery((e, [sheepTag, vec2]) => {
      const newX = Math.cos(seconds) * 3
      const newY = Math.sin(seconds) * 3
      vec2.x = newX
      vec2.y = newY
    })
  }

  const sys_sync_state = (world: World<Clock>) => {
    // TODO eslint is picking this up because of the "use" prefix
    //   can I enable that rule only for the web directory?
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useMonitor(sheepQuery, (e, [, vec2]) => {
      console.log("Adding sheep to state!")
      state.sheepMap.set(e.toString(), new Sheep(vec2.x, vec2.y))
    })

    sheepQuery((e, [sheepTag, vec2]) => {
      const sheep = state.sheepMap.get(e.toString())
      if (sheep) {
        sheep.x = vec2.x
        sheep.y = vec2.y
      }
    })
  }

  const world = createWorld<Clock>({
    systems: [
      sys_test_sheepRunInCircles,
      sys_sync_state
    ],
  })

  // Add one sheep to test
  world.create(
    component(Vec2, {x: 0, y: 0}),
    component(Tag_Sheep)
  )

  return world
}

