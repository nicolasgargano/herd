import { Room, Client } from "colyseus"
import {Player} from "../shared/player"
import {State} from "../shared/state"
import {World} from "@javelin/ecs"
import {setupWorld} from "./world"
import {Clock, createHrtimeLoop} from "@javelin/hrtime-loop"

export class HerdRoom extends Room<State> {
  private world : World<Clock> | undefined

  private playerMap: Map<string, Player> = new Map<string, Player>();

  // When room is initialized
  onCreate(options: any) {
    // initialize empty room state
    this.setState(new State())

    // Called every time this room receives a "move" message
    this.onMessage("*", (client, type, message) => {
      //
      // Triggers when any other type of message is sent
      //
      console.log(client.sessionId, "sent", type, message)
    })

    this.world = setupWorld(this.state)
    createHrtimeLoop(this.world.step, (1000 / 60)).start()
  }

  // When client successfully join the room
  onJoin(client: Client, options: any) {
    this.state.players.set(client.sessionId, new Player(0, 0))
  }

  // When a client leaves the room
  onLeave (client: Client, consented: boolean) { }

  // Cleanup callback, called after there are no more clients in the room. (see `autoDispose`)
  onDispose () { }
}