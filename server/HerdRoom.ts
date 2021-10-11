import http from "http"
import { Room, Client } from "colyseus"
import {Schema, MapSchema, type} from "@colyseus/schema"

// An abstract player object, demonstrating a potential 2D world position
export class Player extends Schema {
  @type("string")
  id: string

  @type("number")
  x: number

  @type("number")
  y: number


  constructor(id: string, x: number, y: number) {
    super()
    this.id = id
    this.x = x
    this.y = y
  }
}

export class State extends Schema {
  @type({ map: Player })
  players = new MapSchema<Player>();

  @type("number")
  currentTimestamp = 0
}

export class HerdRoom extends Room<State> {

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

    this.setSimulationInterval((dt) => this.update(dt))
  }

  // When client successfully join the room
  onJoin(client: Client, options: any) {
    this.state.players.set(client.sessionId, new Player(client.sessionId, 0, 0))
  }

  // Authorize client based on provided options before WebSocket handshake is complete
  onAuth (client: Client, options: any, request: http.IncomingMessage) { }

  // When a client leaves the room
  onLeave (client: Client, consented: boolean) { }

  // Cleanup callback, called after there are no more clients in the room. (see `autoDispose`)
  onDispose () { }

  update (dt: number) {
    this.state.currentTimestamp += dt
  }
}