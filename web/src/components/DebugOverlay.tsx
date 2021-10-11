import {FC, useRef} from "react"
import {State} from "../../../shared/state"
import * as React from "react"
import { Stats } from "@react-three/drei"

export const DebugOverlay: FC<{ gamestate: State }> = ({gamestate}) => {
  return (
    <div className={"w-screen h-screen absolute inset-0 pointer-events-none select-none"}>
      <Stats/>
      <pre className={"text-xs absolute inset-y-15"}>
        {JSON.stringify(gamestate, null, 2)}
      </pre>
    </div>
  )
}
