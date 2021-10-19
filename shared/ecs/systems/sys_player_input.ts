import { Settings, playerControlledDogs } from "../components"
import { World } from "@javelin/ecs"
import { Clock } from "@javelin/hrtime-loop"
import { PlayerInput } from "../../input"
import { TickData } from "../world"

export const sys_player_input = (
  settings: Settings,
  inputMap: Map<string, PlayerInput>,
  world: World<TickData>
) => {
  playerControlledDogs((e, [dog, pos, movement, playerControl]) => {
    movement.velocity.x = 0
    movement.velocity.y = 0

    const input = inputMap.get(playerControl.playerId)

    if (input) {
      const { up, left, down, right } = input

      if (left) movement.velocity.x -= settings.dogSpeed
      if (right) movement.velocity.x += settings.dogSpeed

      if (up) movement.velocity.y += settings.dogSpeed
      if (down) movement.velocity.y -= settings.dogSpeed
    }
  })
}
