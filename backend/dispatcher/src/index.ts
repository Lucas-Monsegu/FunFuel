import express from "express"
import { mustService } from "./utils/tokenCheck"
import Dispatch from "./Dispatch"
import http from "http"
import WebSocket from "ws"
import { dispatchToken, port, isProd } from "./config"
import commands from "./commands"
import Log from "./utils/Log"

// Express
const app = express()
app.use(express.json())
if (!isProd) {
    Log.debug("nocors")
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*")
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
        next()
    })
}

const server = http.createServer(app)

// WebSocketServer
const wss = new WebSocket.Server({ server })
wss.on("connection", (ws: WebSocket) => {
    const webs = ws as any
    webs.isAlive = true
    webs.on("pong", () => {
        webs.isAlive = true
    })
    ws.on("message", (data: any) => {
        const json = JSON.parse(data)
        const command = json.command as string
        if (!(command in commands)) {
            Log.error("Receive undefined command:", command)
            return
        }
        commands[command](json, ws)
    })
    ws.on("close", () => {
        Log.info("websocket closed", webs.game, webs.path)
        Dispatch.deleteService(webs.game, webs.path)
    })
})
const interval = setInterval(function ping() {
    wss.clients.forEach(function each(ws: any) {
        if (ws.isAlive === false) {
            Dispatch.deleteService(ws.game, ws.path)
            Log.warn("Detected BROKEN connection", ws.game, ws.path)
            return ws.terminate()
        }
        ws.isAlive = false
        ws.ping()
    })
}, 10000)
wss.on("close", function close() {
    clearInterval(interval)
})

// room created
app.post("/rooms", mustService, (req, res) => {
    const { game, path, isPublic, name, maxPlayers } = req?.body
    if (game === undefined || path === undefined || isPublic === undefined || name === undefined || maxPlayers === undefined) {
        return res.sendStatus(400)
    }
    const service = Dispatch.getServiceFromPath(game, path)
    if (service) {
        const token = Dispatch.createRoom(service, game, isPublic, name, maxPlayers)
        return res.status(201).json({ token: token })
    }
    else {
        res.sendStatus(500)
    }
})

// game → rooms
app.get("/rooms", (req, res) => {
    const game = req?.query?.game
    if (!game) {
        return res.sendStatus(400)
    }
    const rooms = Dispatch.getRoomList(game)
    if (rooms === undefined) {
        return res.json([])
    }
    return res.json(rooms)
})

// token → path
app.get("/connect", (req, res) => {
    Log.debug("Connect to room")
    const token = req?.query?.token
    if (!token) {
        return res.sendStatus(400)
    }
    const room = Dispatch.connect(token)
    if (!room) {
        return res.sendStatus(404)
    }
    return res.json({
        path: room.service.path
    })
})
app.get("/get-balanced-server", (req, res) => {
    Log.debug("getbalancedserver")
    if (!req?.query?.game) {
        res.sendStatus(400)
    }
    const path = Dispatch.getBalancedService(req?.query?.game)?.path
    if (path) {
        res.json({ path: path })
    }
    else {
        res.sendStatus(503)
    }
})

server.listen(port, function () {
    Log.info("Listening on port", port)
})