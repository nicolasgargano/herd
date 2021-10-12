import { Box } from "@react-three/drei"
import {FC} from "react"
import {MeshProps} from "@react-three/fiber"

export const Dog : FC<MeshProps> = ({...props}) => {
  return (
    <Box {...props} args={[1,1,1]} castShadow receiveShadow>
      <meshStandardMaterial color={"black"}/>
    </Box>
  )
}