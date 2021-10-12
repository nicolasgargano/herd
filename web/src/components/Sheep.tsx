import { Box } from "@react-three/drei"
import * as React from "react"
import {MeshProps} from "@react-three/fiber"
import {FC} from "react"

export const Sheep : FC<MeshProps> = ({...props}) => {
  return (
    <Box  {...props} args={[1, 1, 1]} castShadow receiveShadow>
      <meshStandardMaterial color={"white"}/>
    </Box>
  )
}