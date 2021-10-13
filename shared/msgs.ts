import {ADT} from "ts-adt"
import {PlayerInput} from "./input"

export type ClientMsg = ADT<{
    input: {playerInput: PlayerInput}
}>

export type ServerMsg = ADT<{

}>