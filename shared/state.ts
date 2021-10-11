import {MapSchema, Schema, type} from "@colyseus/schema"
import {Player} from "./player"
import {Sheep} from "./sheep"

export class State extends Schema {
    @type({ map: Player })
    players = new MapSchema<Player>()

    @type({ map: Sheep })
    sheepMap = new MapSchema<Sheep>()
}