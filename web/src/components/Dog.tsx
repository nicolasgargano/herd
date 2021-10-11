import { Box } from "@react-three/drei"
import * as React from "react"

export const Dog = () => {
  return (
    <Box args={[1,1,1]}>
      <meshStandardMaterial color={"black"}/>
    </Box>
  )
}