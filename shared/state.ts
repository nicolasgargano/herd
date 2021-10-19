import { MapSchema, Schema, type } from "@colyseus/schema"
import { Player } from "./player"
import { Sheep } from "./sheep"
import { Dog } from "./dog"
import { Team } from "./team"

export type GameStage = "waiting" | "playing" | "done"

export class State extends Schema {
  @type("string")
  gamestate: GameStage = "waiting"

  @type({ map: Player })
  players = new MapSchema<Player>()

  @type({ map: Sheep })
  sheepMap = new MapSchema<Sheep>()

  @type({ map: Dog })
  dogsMap = new MapSchema<Dog>()

  @type(Team)
  redTeam = new Team("red", 0)

  @type(Team)
  blueTeam = new Team("blue", 0)
}
