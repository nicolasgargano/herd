import {Server} from "colyseus"
import { createServer } from "http"
import express from "express"
import cors from "cors"
import {HerdRoom} from "./HerdRoom"

const port = Number(process.env.port) || 8000

const app = express()
app.use(cors())
app.use(express.json())

const httpServer = createServer(app)
const gameServer = new Server({server: httpServer})

gameServer.define("herd", HerdRoom)

gameServer.listen(port)
  .then(_ => console.log(`Listening on port ${port}`))
  .catch(err => console.error(err))