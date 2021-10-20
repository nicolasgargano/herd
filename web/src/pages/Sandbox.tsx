import { Suspense, useRef, useState } from "react"
import { component, ComponentOf, createWorld, toComponent } from "@javelin/ecs"
import { sys_sheep_neighboring } from "../../../shared/ecs/systems/sys_sheep_neighboring"
import {
  dogsQuery,
  Movement,
  PlayerControl,
  Position,
  settings,
  sheepQuery,
  Vec2
} from "../../../shared/ecs/components"
import * as components from "../../../shared/ecs/components"
import { sys_alignment } from "../../../shared/ecs/systems/sys_alignment"
import { sys_sheep_grouping } from "../../../shared/ecs/systems/sys_sheep_grouping"
import { sys_player_input } from "../../../shared/ecs/systems/sys_player_input"
import { sys_clamp_sheep_speed } from "../../../shared/ecs/systems/sys_clamp_sheep_speed"
import { sys_sheep_dog_evasion } from "../../../shared/ecs/systems/sys_sheep_dog_evasion"
import { sys_sheep_separation } from "../../../shared/ecs/systems/sys_sheep_separation"
import { sys_movement } from "../../../shared/ecs/systems/sys_movement"
import { sys_reset_sheep_acceleration } from "../../../shared/ecs/systems/sys_reset_sheep_acceleration"
import { sys_movement_slow_down } from "../../../shared/ecs/systems/sys_movement_slow_down"
import { sys_spawn_sheep } from "../../../shared/ecs/systems/sys_spawn_sheep"
import { Vector2 } from "three"
import { PlayerInput } from "../../../shared/input"
import { useKeyDown } from "../hooks/useKeyDown"
import { sys_movement_clamp } from "../../../shared/ecs/systems/sys_movement_clamp"
import { Sheep } from "../components/Sheep"
import { Box, OrbitControls, Stage, Text } from "@react-three/drei"
import * as React from "react"
import { Canvas } from "@react-three/fiber"
import { Dog } from "../components/Dog"
import { TickData } from "../../../shared/ecs/world"
import { useInterval } from "../hooks/useInterval"

const sandboxDogId = "sandbox-dog"

export const Sandbox = () => {
  const up = useKeyDown("w")
  const left = useKeyDown("a")
  const down = useKeyDown("s")
  const right = useKeyDown("d")
  const inputMapRef = useRef(
    new Map<string, PlayerInput>([
      [
        sandboxDogId,
        {
          up: up.current,
          left: left.current,
          down: down.current,
          right: right.current
        }
      ]
    ])
  )

  const [world] = useState(makeSandboxWorld(sandboxDogId, inputMapRef.current))
  const [sheepMap] = useState(new Map<string, ComponentOf<typeof Vec2>>())
  const [dogsMap] = useState(new Map<string, ComponentOf<typeof Vec2>>())
  const [tick, setTick] = useState(0)
  const [tickData] = useState({ dt: 0, tick: 0, time: 0 })

  useInterval(tick => {
    tickData.tick = tick
    tickData.dt = 1 / 60
    tickData.time += 1 / 60

    const input = inputMapRef.current.get(sandboxDogId)
    if (input) {
      input.up = up.current
      input.left = left.current
      input.down = down.current
      input.right = right.current
    }

    sheepQuery.bind(world)((id, [, vec2]) => {
      sheepMap.set(id.toString(), vec2)
    })

    dogsQuery.bind(world)((id, [, vec2]) => {
      dogsMap.set(id.toString(), vec2)
    })

    world.step(tickData)
    setTick(tick => tick + 1)
  }, 1000 / 60)

  return (
    <>
      <Canvas
        onCreated={three => {
          three.camera.position.set(0, 30, 20)
        }}
      >
        <Text>{tick}</Text>
        <Suspense fallback={null}>
          <Stage shadows environment={"forest"} adjustCamera={false}>
            {[...sheepMap.entries()].map(([id, sheep]) => (
              <Sheep key={id} position={[sheep.x, 0, -sheep.y]} />
            ))}
            {[...dogsMap.entries()].map(([id, dog]) => (
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
          </Stage>
        </Suspense>
        <OrbitControls />
      </Canvas>
    </>
  )
}

const makeSandboxWorld = (
  sandboxDogId: string,
  inputMap: Map<string, PlayerInput>
) => {
  const world = createWorld<TickData>({
    systems: [
      sys_reset_sheep_acceleration,
      world => sys_sheep_neighboring(settings, world),
      world => sys_alignment(settings, world),
      world => sys_sheep_grouping(settings, world),
      world => sys_player_input(settings, inputMap, world),
      world => sys_clamp_sheep_speed(settings, world),
      world => sys_sheep_dog_evasion(settings, world),
      world => sys_sheep_separation(settings, world),
      sys_movement,
      sys_movement_slow_down,
      sys_spawn_sheep,
      world => sys_movement_clamp(settings, world)
    ]
  })

  world.create(
    component(components.Dog),
    component(PlayerControl, { playerId: sandboxDogId }),
    toComponent(new Vector2(0, 0), Position),
    component(Movement, {
      velocity: toComponent(new Vector2(0, 0), Vec2),
      acceleration: toComponent(new Vector2(0, 0), Vec2)
    })
  )

  return world
}
