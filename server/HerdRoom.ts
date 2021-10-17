import {Room, Client} from "colyseus"
import {Player} from "../shared/player"
import {State} from "../shared/state"
import {component, toComponent, World} from "@javelin/ecs"
import {setupWorld} from "./world"
import {Clock, createHrtimeLoop} from "@javelin/hrtime-loop"
import {PlayerInput} from "../shared/input"
import {ClientMsg} from "../shared/msgs"
import {match} from "ts-adt"
import {pipe} from "fp-ts/function"
import {Dog, Movement, PlayerControl, Position, Sheep, Vec2} from "./ecs/components"
import {Vector2} from "three"

export class HerdRoom extends Room<State> {
    private world: World<Clock> | undefined

    private playerMap: Map<string, Player> = new Map<string, Player>();
    private inputMap: Map<string, PlayerInput> = new Map<string, PlayerInput>();

    // When room is initialized
    onCreate(options: any) {
      // initialize empty room state
      this.setState(new State())
      this.setPatchRate(1000/60)

      this.onMessage("*", (client, type, message) => {
        const msg = message as ClientMsg

        pipe(
          msg,
          match({
            input: ({playerInput}) => {
              this.inputMap.set(client.id, playerInput)
            },
            setReady: ({ready}) => {
              const currentPlayer = this.state.players.get(client.id)
              if (currentPlayer) currentPlayer.ready = ready
            },
            start: () => {
              const allReady = [...this.state.players.values()].every(p => p.ready)
              if (allReady) this.state.gamestate = "playing"
            }
          })
        )

        //
        // Triggers when any other type of message is sent
        //
        console.log(client.id, "sent", type, message)
      })

      this.world = setupWorld(this.state, this.inputMap)

      createHrtimeLoop(clock => {
        if (this.state.gamestate === "playing")
          this.world?.step(clock)
      }, (1000 / 60)).start()
    }

    // When client successfully join the room
    onJoin(client: Client, options: any) {
      this.state.players.set(client.id, new Player(0, 0, false))
      this.inputMap.set(client.id, {up: false, left: false, down: false, right: false})
      this.world?.create(
        component(Dog),
        component(PlayerControl, {playerId: client.id}),
        toComponent(new Vector2(0, 0), Position),
        component(Movement,
          {
            velocity: toComponent(new Vector2(0, 0), Vec2),
            acceleration: toComponent(new Vector2(0, 0), Vec2)
          }
        )
      )
    }

    // When a client leaves the room
    onLeave(client: Client, consented: boolean) {
    }

    // Cleanup callback, called after there are no more clients in the room. (see `autoDispose`)
    onDispose() {
    }
}