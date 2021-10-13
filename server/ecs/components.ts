import * as javelin from "@javelin/ecs"
import {createQuery, registerSchema} from "@javelin/ecs"

export const Vec2 = {
  x: javelin.number,
  y: javelin.number
}
export const Position = Vec2
export const Movement = {
  velocity: Vec2,
  acceleration: Vec2
}
export const Sheep = {
  running: javelin.boolean,
  neighbors: javelin.arrayOf(javelin.number)
}
export const Dog = {}
export const PlayerControl = {
  playerId: javelin.string
}

registerSchema(Position, 1)
registerSchema(Movement, 2)
registerSchema(Sheep, 3)
registerSchema(Dog, 4)
registerSchema(PlayerControl, 5)

export const sheepQuery = createQuery(Sheep, Position)
export const dogsQuery = createQuery(Dog, Position)
export const movementQuery = createQuery(Position, Movement)
export const sheepMovementQuery = createQuery(Sheep, Position, Movement)
export const playerControlledDogs = createQuery(Dog, Position, Movement, PlayerControl)

export type Settings = {
  amountOfSheep: number
  alertRadius: number
  neighboringRadius: number
  maxSteerForce: number
  minSpeed: number
  maxSpeed: number
  alignmentWeight: number
  groupingWeight: number
  separationWeight: number
  dogEvasionWeight: number,
  dogSpeed: number
}

export const settings: Settings = {
  amountOfSheep: 30,
  alertRadius: 5,
  neighboringRadius: 5,
  minSpeed: 5,
  maxSpeed: 12,
  maxSteerForce: 4,
  separationWeight: 2,
  alignmentWeight: 3,
  groupingWeight: 2,
  dogEvasionWeight: 10,
  dogSpeed: 15
}