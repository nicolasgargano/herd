import { Room, Client } from "colyseus"
import { Player } from "../shared/player"
import { State } from "../shared/state"
import { component, toComponent, World } from "@javelin/ecs"
import { Clock, createHrtimeLoop } from "@javelin/hrtime-loop"
import { PlayerInput } from "../shared/input"
import { ClientMsg } from "../shared/msgs"
import { match } from "ts-adt"
import { pipe } from "fp-ts/function"
import {
  Dog,
  Movement,
  PlayerControl,
  Position,
  Sheep,
  Vec2
} from "../shared/ecs/components"
import { Vector2 } from "three"
import { setupWorld, TickData } from "../shared/ecs/world"

export class HerdRoom extends Room<State> {
  private world: World<TickData> | undefined

  private inputMap: Map<string, PlayerInput> = new Map<string, PlayerInput>()

  // When room is initialized
  onCreate(options: any) {
    // initialize empty room state
    this.setState(new State())
    this.setPatchRate(1000 / 60)

    this.onMessage("*", (client, type, message) => {
      const msg = message as ClientMsg

      pipe(
        msg,
        match({
          input: ({ playerInput }) => {
            this.inputMap.set(client.id, playerInput)
          },
          setReady: ({ ready }) => {
            const currentPlayer = this.state.players.get(client.id)
            if (currentPlayer) currentPlayer.ready = ready
          },
          start: () => {
            const allReady = [...this.state.players.values()].every(
              p => p.ready
            )
            if (allReady) this.state.gamestate = "playing"
          }
        })
      )
    })

    this.world = setupWorld(this.state, this.inputMap)

    const tickData = {
      dt: 0,
      tick: 0,
      time: 0
    }

    createHrtimeLoop(clock => {
      const dt = clock.dt / 1000
      tickData.time = Number(clock.now)
      tickData.dt = dt
      tickData.tick = clock.tick
      if (this.state.gamestate === "playing") this.world?.step(tickData)
    }, 1000 / 60).start()
  }

  // When client successfully join the room
  async onJoin(client: Client, options: any) {
    const topTeamPlayers = [...this.state.players.values()].filter(
      p => p.team === this.state.topTeam
    ).length
    const bottomTeamPlayers = [...this.state.players.values()].filter(
      p => p.team === this.state.bottomTeam
    ).length
    const teamToJoin =
      topTeamPlayers < bottomTeamPlayers
        ? this.state.topTeam
        : this.state.bottomTeam

    this.state.players.set(client.id, new Player(false, teamToJoin))

    this.inputMap.set(client.id, {
      up: false,
      left: false,
      down: false,
      right: false
    })
    this.world?.create(
      component(Dog),
      component(PlayerControl, { playerId: client.id }),
      toComponent(new Vector2(0, 0), Position),
      component(Movement, {
        velocity: toComponent(new Vector2(0, 0), Vec2),
        acceleration: toComponent(new Vector2(0, 0), Vec2)
      })
    )

    if (this.state.players.size >= 4) await this.lock()
  }

  // When a client leaves the room
  async onLeave(client: Client, consented: boolean) {
    if (this.locked) await this.unlock()
  }

  // Cleanup callback, called after there are no more clients in the room. (see `autoDispose`)
  onDispose() {}
}
