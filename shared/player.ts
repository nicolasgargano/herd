import {Schema, type} from "@colyseus/schema"

export class Player extends Schema {
    @type("number")
    x: number

    @type("number")
    y: number

    @type("boolean")
    ready: boolean

    constructor(x: number, y: number, ready: boolean) {
      super()
      this.x = x
      this.y = y
      this.ready = ready
    }
}
