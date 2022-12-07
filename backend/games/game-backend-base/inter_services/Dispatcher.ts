import { serviceUrl, dispatcherHttp, dispatcherWs, gameName, dispatchToken } from "../../config"
import Jfetch from "../utils/Jfetch"
import ws from "ws"
import WebSocket from "ws"
import Log from "../utils/Log"

export default class Dispatcher {
    static ws: WebSocket
    static async addService() {
        this.ws = new WebSocket(dispatcherWs)
        this.ws.onopen = () => {
            this.ws.send(JSON.stringify({ command: "start", game: gameName, path: serviceUrl, dispatchToken: dispatchToken }))
            Log.info("service add to dispatcher")
        }
        this.ws.onerror = err => {
            Log.error("Error connecting ws to dispatcher", err)
            // process.exit()
        }
    }
    static newMaster(token: string, avatarUrl: string) {
        Log.debug("send avatar", avatarUrl)
        this.ws.send(JSON.stringify({ command: "new_master", dispatchToken: dispatchToken, token: token, avatarUrl: avatarUrl }))
    }
    static updateRooms(token: string, number: number) {
        Log.debug("send update room", number)
        this.ws.send(JSON.stringify({ command: "room_update", dispatchToken: dispatchToken, token: token, numberPlayers: number }))
    }
    static async createRoom(game: string, isPublic: boolean, name: string, maxPlayers: number) {
        const res = await Jfetch.post(`${dispatcherHttp}/rooms`, {
            game: game, path: serviceUrl, isPublic, serviceToken: dispatchToken, name: name, maxPlayers: maxPlayers
        })
        if (res.status != 201) {
            return null
        }
        return (await res.json()).token
    }
    static deleteRoom(token: string) {
        Log.info("deleteRoom")
        this.ws.send(JSON.stringify({ command: "room_delete", game: gameName, token: token, dispatchToken: dispatchToken }))
    }
}