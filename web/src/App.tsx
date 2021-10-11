import * as React from "react"
import {FC, Suspense, useEffect, useRef, useState} from "react"
import * as Colyseus from "colyseus.js"
import {State} from "../../shared/state"
import {Stage} from "@react-three/drei/core/Stage"
import {Box, Html, OrbitControls, Text} from "@react-three/drei"
import {Canvas, useFrame} from "@react-three/fiber"
import {Sheep} from "./components/Sheep"
import {Dog} from "./components/Dog"
import {DebugOverlay} from "./components/DebugOverlay"

export const Scene: FC<{ gamestate: State }> = ({gamestate}) => {
  return (
    <>
      <Suspense fallback={null}>
        <Stage>
          <Box position={[0, -1.5, 0]} args={[10, 2, 10]}>
            <meshStandardMaterial color={"green"}/>
          </Box>
          {
            [...gamestate.sheepMap.entries()]
              .map(([id, sheep]) =>
                <Sheep key={id} position={[sheep.x, 0, sheep.y]}/>
              )
          }
          {
            [...gamestate.dogsMap.entries()]
              .map(([id, dog]) =>
                <Dog key={id} position={[dog.x, 0, dog.y]}/>
              )
          }
        </Stage>
      </Suspense>
      <OrbitControls/>
    </>
  )
}

export const App = () => {
  const [client] = useState(new Colyseus.Client("ws://localhost:8000"))
  const stateRef = useRef<State>()
  const [n, setN] = useState(0)

  useEffect(() => {
    join()
  }, [])

  // TODO proper render loop
  useEffect(() => {
    setInterval(() => {
      setN(n => n + 1)
    }, 1000 / 60)
  }, [])

  const join = async () => {
    const room = await client.joinOrCreate<State>("herd")
    stateRef.current = room.state
  }

  return (
    <>
      <Canvas>
        {stateRef.current && <Scene gamestate={stateRef.current}/>}
      </Canvas>
      {stateRef.current && <DebugOverlay gamestate={stateRef.current}/>}
    </>
  )
}
