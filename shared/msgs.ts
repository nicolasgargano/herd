import { ADT } from "ts-adt"
import { PlayerInput } from "./input"

export type ClientMsg = ADT<{
  input: { playerInput: PlayerInput }
  setReady: { ready: boolean }
  start: {}
}>

export type ServerMsg = ADT<{}>
