import {State} from "../../../shared/state"
import {FC} from "react"
import * as React from "react"

export type OverlayProps = {
    state: State,
    onReady: () => void,
    onStart: () => void
}

export const Overlay : FC<OverlayProps> = (props) => {
  switch (props.state.gamestate) {
  case "waiting":
    return (
      <Waiting {...props}/>
    )
  case "playing":
    // TODO I think I'll make it diegetic
    return null
  case "done":
    // TODO
    return null
  }
  return null
}

const Waiting: FC<OverlayProps> = ({state, onStart, onReady}) => {
  const players = [...state.players.entries()]
  return (
    <div className={"w-screen h-screen absolute inset-0 select-none"}>
      <div className={"flex flex-col"}>
        <h1>Herd</h1>
        <table>
          <thead>
            <tr>
              <th>Status</th>
              <th>Id</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {players.map(([id, player]) => (
              <tr key={id}>
                <td>{player.ready ? "Ready" : "Not ready"}</td>
                <td>{id}</td>
                <td><button onClick={onReady}>Ready</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={onStart}>Start</button>
      </div>
    </div>
  )
}