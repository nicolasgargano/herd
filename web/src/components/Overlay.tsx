import { State } from "../../../shared/state"
import { FC } from "react"
import * as React from "react"
import { Player } from "../../../shared/player"

export type OverlayProps = {
  state: State
  currentPlayerId: string
  onReady: () => void
  onStart: () => void
}

export const Overlay: FC<OverlayProps> = props => {
  switch (props.state.gamestate) {
    case "waiting":
      return <Waiting {...props} />
    case "playing":
      // TODO I think I'll make it diegetic
      return null
    case "done":
      // TODO
      return null
  }
  return null
}

const PlayerBlock: FC<{
  id: string
  player: Player
  currentPlayerId: string
  onReady: () => void
}> = ({ id, player, currentPlayerId, onReady }) => (
  <div
    className={`p-5 rounded flex flex-col
    ${player.team.name === "blue" ? "bg-blue-500" : "bg-red-500"}
    ${id === currentPlayerId && !player.ready ? "cursor-pointer" : ""}
    `}
    onClick={() => {
      if (id === currentPlayerId) onReady()
    }}
  >
    {player.ready ? (
      <p>READY</p>
    ) : id === currentPlayerId ? (
      <p>CLICK TO SET READY</p>
    ) : (
      <p>NOT READY</p>
    )}
  </div>
)

const Waiting: FC<OverlayProps> = ({
  state,
  onStart,
  onReady,
  currentPlayerId
}) => {
  const players = [...state.players.entries()]
  return (
    <div
      className={
        "w-screen h-screen absolute inset-0 select-none flex flex-col justify-center items-center space-y-5"
      }
    >
      <>
        {players.map(([id, player]) => (
          <PlayerBlock
            key={id}
            id={id}
            player={player}
            currentPlayerId={currentPlayerId}
            onReady={onReady}
          />
        ))}
        <button className={"bg-blue-900 p-2 rounded"} onClick={onStart}>
          Start
        </button>
      </>
    </div>
  )
}
