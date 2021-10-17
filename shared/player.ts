import { Schema, type } from "@colyseus/schema"
import { Team } from "./team"

export class Player extends Schema {
  @type("number")
  x: number

  @type("number")
  y: number

  @type("boolean")
  ready: boolean

  @type(Team)
  team: Team

  constructor(x: number, y: number, ready: boolean, team: Team) {
    super()
    this.x = x
    this.y = y
    this.ready = ready
    this.team = team
  }
}
