import {Schema, type} from "@colyseus/schema"

export class Team extends Schema {
    @type("string")
    name  = "waiting"

    @type("number")
    points  = 0

    constructor(name: string, points: number) {
      super()
      this.name = name
      this.points = points
    }
}