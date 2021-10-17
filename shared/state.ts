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
  topTeam = new Team("top", 0)

  @type(Team)
  bottomTeam = new Team("bottom", 0)
}
