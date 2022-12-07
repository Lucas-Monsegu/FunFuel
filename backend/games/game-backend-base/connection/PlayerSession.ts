import WebSocket from "ws"
import LobbyInterface from "../lobby/LobbyInterface"
import Player from "../lobby/Player"
import Metrics from "../metrics/Metrics"
import { Lobby } from "../../game/Lobby"
import Manager from "../lobby/Manager"
import { Http2SecureServer } from "http2"
import http from "http"
import CookieToObject from "../utils/CookieParse"
import Jfetch from "../utils/Jfetch"
import { mainUrl, dispatchToken } from "../../config"
import Log from "../utils/Log"
import crypto from "crypto"
import CommandData from "../command_client"



export default class PlayerSession {
    private static addPlayerToLobby(userData: any, ws: WebSocket, token: string, sessionId: string): [Lobby, Player] | null {
        let lobby
        try {
            lobby = Manager.getLobby(token)
        }
        catch (error) {
            ws.send(JSON.stringify({ command: "ConnectionError", erro: "Invalid link" }))
            return null
        }
        if (lobby.isFull()) {
            ws.send(JSON.stringify({ command: "ConnectionError", erro: "Lobby already full" }))
            return null
        }
        const player = lobby.addPlayer(userData, ws, sessionId)
        return [lobby, player]
    }
    static async getPublicId(req: http.IncomingMessage) {
        const cookies = CookieToObject(req.headers.cookie)
        if (!cookies || !cookies["express:sess"]) {
            return { username: "Default" }
        }
        const decodedCookie = Buffer.from(cookies["express:sess"], "base64").toString()
        let objCookie = JSON.parse(decodedCookie)
        if (!(objCookie["passport"]) || !(objCookie["passport"]["user"])) {
            return { username: "Default" }

        }
        const userId = objCookie["passport"]["user"]
        if (!userId) {
            return { username: "Default" }
        }
        const res = await Jfetch.post(`${mainUrl}/private-id-to-user`, {
            token: dispatchToken,
            privateId: userId
        })
        console.log(res)
        const user = await res.json()

        return user
    }
    static createSessionId(): string {
        return crypto.randomBytes(5).toString("hex")
    }

    static async onConnection(ws: WebSocket, req: http.IncomingMessage, token: string, sessionId: string | undefined) {
        Log.info("Player connected", sessionId)
        let currentLobby: Lobby | undefined = undefined
        let currentPlayer: Player | undefined = undefined
        if (sessionId) {
            const lobby = Manager.getLobby(token)
            if (!lobby) {
                return
            }
            const player = lobby.getPlayerFromSessionId(sessionId)
            console.log(sessionId)
            if (player) {
                console.log("in session id", sessionId, player.connected)
                if (player.connected) {
                    console.log("replace")
                }
                player.replace(ws)
                player.replaceUser(await this.getPublicId(req))
                currentLobby = lobby
                currentPlayer = player
                currentPlayer.connected = true
                currentLobby?.sendSingle({ command: "Connected", sessionId: sessionId, publicId: player.id, roomName: currentLobby.name }, player.id)
                currentLobby?.sendPlayersInfos()
                currentLobby?.sendTeamInfos()
            }

        }
        ws.on("close", () => {
            console.log('close')
            const webs: any = ws
            if (webs.replaced !== true && currentLobby && currentPlayer) {
                Log.info("PLAYER LEFFT")
                currentLobby.disconnectPlayer(currentPlayer)
            }
        })
        ws.on("message", async function (msg: string) {
            Metrics.receivedMessage()
            let parsedMsg = JSON.parse(msg)
            if (currentPlayer == undefined || currentLobby == undefined) {
                const lobby = Manager.getLobby(token)
                if (!lobby) {
                    ws.send(JSON.stringify({ command: "WsClosed", reason: "LobbyDoesNotExist" }))
                    ws.close()
                    return
                }
                else if (!lobby.isPrivate() || lobby.getNumberOfPlayers() === 0 || (parsedMsg.command == "CheckPassword" && lobby.checkPassword(parsedMsg.password))) {
                    const userData = await PlayerSession.getPublicId(req)
                    const sessionId = PlayerSession.createSessionId()
                    const res = PlayerSession.addPlayerToLobby(userData, ws, token, sessionId)
                    if (res == null) {
                        ws.close()
                        return
                    }
                    currentLobby = res[0]
                    currentPlayer = res[1]
                }
                else {
                    ws.send(JSON.stringify({ command: "InvalidPassword" }))
                }
                return
            }
            const command = parsedMsg.command
            console.log(parsedMsg, CommandData.check(parsedMsg, command))
            if (CommandData.check(parsedMsg, command)) {
                Log.debug("recieved command", command)
                // @ts-ignore
                currentLobby[command](parsedMsg, currentPlayer)
            }
            // Log.info("received message")
        })
    }
}