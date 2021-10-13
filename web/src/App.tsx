import * as React from "react"
import {FC, Suspense, useEffect, useRef, useState} from "react"
import * as Colyseus from "colyseus.js"
import {State} from "../../shared/state"
import {Box, OrbitControls, Stage} from "@react-three/drei"
import {Canvas} from "@react-three/fiber"
import {Sheep} from "./components/Sheep"
import {Dog} from "./components/Dog"
import {DebugOverlay} from "./components/DebugOverlay"
import {useInterval} from "./hooks/useInterval"
import {useKeyDown} from "./hooks/useKeyDown"

export const Scene: FC<{ gamestate: State }> = ({gamestate}) => {
  return (
    <>
      <Suspense fallback={null}>
        <Stage shadows environment={"forest"} adjustCamera={false}>
          {
            [...gamestate.sheepMap.entries()]
              .map(([id, sheep]) =>
                <Sheep key={id} position={[sheep.x, 0, -sheep.y]}/>
              )
          }
          {
            [...gamestate.dogsMap.entries()]
              .map(([id, dog]) =>
                <Dog key={id} position={[dog.x, 0, -dog.y]}/>
              )
          }
          <Box position={[0, -1.5, 0]} args={[34, 2, 55]} receiveShadow castShadow>
            <meshStandardMaterial color={"green"}/>
          </Box>
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

  const up = useKeyDown("w")
  const left = useKeyDown("a")
  const down = useKeyDown("s")
  const right = useKeyDown("d")

  useEffect(() => {
    join()
  }, [])

  // TODO proper render loop
  useEffect(() => {
    setInterval(() => {
      setN(n => n + 1)
    }, 1000/60)
  }, [])

  const join = async () => {
    const room = await client.joinOrCreate<State>("herd")
    stateRef.current = room.state
    setInterval(() => {
      room.send("clientMsg", {
        _type: "input",
        playerInput: {
          up: up.current,
          left: left.current,
          down: down.current,
          right: right.current
        }
      })
    }, 1000/20)
  }

  return (
    <>
      <Canvas
        shadows
        onCreated={state => {
          state.camera.position.set(0, 40, 10)
        }}
      >
        {stateRef.current && <Scene gamestate={stateRef.current}/>}
      </Canvas>
      {stateRef.current && <DebugOverlay arbitrary={{up, left, down, right}} gamestate={stateRef.current}/>}
    </>
  )
}
