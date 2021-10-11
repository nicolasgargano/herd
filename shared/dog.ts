import {Schema, type} from "@colyseus/schema"

export class Dog extends Schema {
    @type("number")
    x: number

    @type("number")
    y: number

    constructor(x: number, y: number) {
      super()
      this.x = x
      this.y = y
    }
}
