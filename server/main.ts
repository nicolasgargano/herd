import {RedisPresence, Server} from "colyseus"
import { createServer } from "http"
import express from "express"
import cors from "cors"
import {WebSocketTransport} from "colyseus.js/lib/transport/WebSocketTransport"
const port = Number(process.env.port) || 3000

const app = express()
app.use(cors())
app.use(express.json())

const httpServer = createServer(app)
const gameServer = new Server({
  server: httpServer,
  presence: new RedisPresence()
})

gameServer.listen(port)
  .then(_ => console.log(`Listening on port ${port}`))
  .catch(err => console.error(err))