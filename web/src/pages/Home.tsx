import * as React from "react"
import { FC, Suspense, useEffect, useRef, useState } from "react"
import * as Colyseus from "colyseus.js"
import { State } from "../../../shared/state"
import { Box, OrbitControls, Stage, Text } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { Sheep } from "../components/Sheep"
import { Dog } from "../components/Dog"
import { DebugOverlay } from "../components/DebugOverlay"
import { useKeyDown } from "../hooks/useKeyDown"
import { Overlay } from "../components/Overlay"
import { Room } from "colyseus.js"
import { settings } from "../../../shared/ecs/components"
import SyneMonoUrl from "../../assets/SyneMono-Regular.ttf?url"

export const Scene: FC<{ gamestate: State }> = ({ gamestate }) => {
  return (
    <>
      <Suspense fallback={null}>
        <Stage shadows environment={"forest"} adjustCamera={false}>
          {[...gamestate.sheepMap.entries()].map(([id, sheep]) => (
            <Sheep key={id} position={[sheep.x, 0, -sheep.y]} />
          ))}
          {[...gamestate.dogsMap.entries()].map(([id, dog]) => (
            <Dog key={id} position={[dog.x, 0, -dog.y]} />
          ))}
          <Box
            position={[0, -1.5, 0]}
            args={[
              settings.worldHalfExtents[0] * 2 + 1,
              2,
              settings.worldHalfExtents[1] * 2 + 1
            ]}
            receiveShadow
            castShadow
          >
            <meshStandardMaterial color={"green"} />
          </Box>

          <Text
            anchorX={"center"}
            anchorY={"bottom"}
            color={"blue"}
            textAlign={"center"}
            fontSize={settings.worldHalfExtents[1]}
            font={SyneMonoUrl}
            rotation={[0, Math.PI / 2, 0]}
            position={[-settings.worldHalfExtents[0] - 0.5, 0, 0]}
          >
            {Math.floor(gamestate.blueTeam.points).toString().padStart(4, "0")}
          </Text>

          <Text
            anchorX={"center"}
            anchorY={"bottom"}
            color={"red"}
            textAlign={"center"}
            fontSize={settings.worldHalfExtents[1]}
            font={SyneMonoUrl}
            rotation={[0, -Math.PI / 2, 0]}
            position={[settings.worldHalfExtents[0] + 0.5, 0, 0]}
          >
            {Math.floor(gamestate.redTeam.points).toString().padStart(4, "0")}
          </Text>

          <Box
            position={[
              -settings.worldHalfExtents[0] + settings.scoringAreaWidth,
              -1.5,
              0
            ]}
            args={[0.5, 2.005, settings.worldHalfExtents[1] * 2 + 1.005]}
            receiveShadow
            castShadow
          >
            <meshStandardMaterial color={"blue"} />
          </Box>

          <Box
            position={[
              settings.worldHalfExtents[0] - settings.scoringAreaWidth,
              -1.5,
              0
            ]}
            args={[0.5, 2.005, settings.worldHalfExtents[1] * 2 + 1.005]}
            receiveShadow
            castShadow
          >
            <meshStandardMaterial color={"red"} />
          </Box>
        </Stage>
      </Suspense>
      <OrbitControls autoRotate={gamestate.gamestate === "done"} />
    </>
  )
}

export const Home = () => {
  const [client] = useState(
    new Colyseus.Client(`${import.meta.env.VITE_SERVER_URL}`)
  )
  const roomRef = useRef<Room<State>>()
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
    }, 1000 / 60)
  }, [])

  const join = async () => {
    const room = await client.joinOrCreate<State>("herd")
    roomRef.current = room
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
    }, 1000 / 20)
  }

  return (
    <>
      <Canvas
        shadows
        onCreated={state => {
          state.camera.position.set(0, 30, 20)
        }}
      >
        {roomRef.current && <Scene gamestate={roomRef.current.state} />}
      </Canvas>
      {roomRef.current && (
        <DebugOverlay
          arbitrary={{ up, left, down, right }}
          gamestate={roomRef.current.state}
        />
      )}
      {roomRef.current && (
        <Overlay
          state={roomRef.current.state}
          onReady={() =>
            roomRef.current?.send("clientMsg", {
              _type: "setReady",
              ready: true
            })
          }
          onStart={() => roomRef.current?.send("clientMsg", { _type: "start" })}
        ></Overlay>
      )}
    </>
  )
}
