import { Schema, type } from "@colyseus/schema"
import { Team } from "./team"

export class Player extends Schema {
  @type("boolean")
  ready: boolean

  @type(Team)
  team: Team

  constructor(ready: boolean, team: Team) {
    super()
    this.ready = ready
    this.team = team
  }
}
