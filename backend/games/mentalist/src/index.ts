import { gameName, port, isProd } from "./config"
import WebSocket from "ws"
import Dispatcher from "./base/inter_services/Dispatcher"
import express from "express"
import MetricsRoutes from "./base/metrics"
import http from "http"
import Log from "./base/utils/Log"
import Manager from "./base/lobby/Manager"
import CreateRoomInterface from "./base/interfaces/CreateRoomInterface"
import PlayerSession from "./base/connection/PlayerSession"



// Express
const app = express()
app.use(express.json())
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", isProd ? "https://funfuel.io" : "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next()
})

app.use("/", MetricsRoutes)
const server = http.createServer(app)
app.post("/create-room", async (req, res) => {
    const { game, isPublic, name, password, maxPlayers } = req?.body
    if (typeof game === "string" &&
        typeof isPublic === "boolean" &&
        typeof name === "string" &&
        typeof password === "string" &&
        Number.isInteger(maxPlayers) && maxPlayers > 0 && maxPlayers <= 100) {
        const truncateName = name.substr(0, 25)
        const token: string | null = await Dispatcher.createRoom(game, isPublic, truncateName, maxPlayers)
        if (token != null) {
            res.json({ token: token })
            Manager.createLobby(req?.body as CreateRoomInterface, token)
        }
        else {
            res.status(500).json({ error: "failed to create room" })
        }
    }
    else {
        res.sendStatus(400)
    }
})
// WebSocketServer
const wss = new WebSocket.Server({ server })

wss.on("listening", async () => {
    Log.debug("listen")
    try {
        await Dispatcher.addService()
    } catch (error) {
        Log.error("Cannot connect to Dispatcher, it might not be running", error)
        process.exit()
    }
    Log.info(`Service: ${gameName}`)
})

wss.on("connection", async function connection(ws, req) {
    Log.debug("connect")
    if (!req.url) {
        Log.warn("Invalid url from front while connecting to websocket")
        return
    }
    const s = req?.url?.split("/")

    const token = s[1]
    const sessionId = s[2]
    if (!token) {
        ws.close()
        return
    }
    const webs = ws as any
    webs.isAlive = true
    webs.on("pong", () => {
        webs.isAlive = true
    })
    await PlayerSession.onConnection(ws, req, token, sessionId)
})
const interval = setInterval(function ping() {
    wss.clients.forEach(function each(ws: any) {
        if (ws.isAlive === false) {
            Log.warn("Detected BROKEN connection", ws.game, ws.path)
            return ws.terminate()

        }
        ws.isAlive = false
        ws.ping()
    })
}, 5000)

server.listen(port, function () {
    Log.info("Listening on port", port)
})