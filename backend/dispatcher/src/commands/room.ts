import WebSocket = require("ws")
import Dispatch from "../Dispatch"
import { dispatchToken as dToken } from "../config"
import Log from "../utils/Log"

export default {
    "room_update": (json: any, ws: WebSocket) => {
        Log.info("received update room", json)
        const { token, numberPlayers, dispatchToken } = json
        if (dispatchToken === dToken && token != undefined && numberPlayers != undefined) {
            Dispatch.updateRoom(token, numberPlayers)
        }
    },
    "room_delete": (json: any, ws: WebSocket) => {
        const { game, token, dispatchToken } = json
        if (dispatchToken === dToken && game && token) {
            Dispatch.deleteRoom(game, token)
        }
    },
    "new_master": (json: any, ws: WebSocket) => {
        const { dispatchToken, token, avatarUrl } = json
        if (dispatchToken === dToken && avatarUrl && token) {
            Dispatch.newMaster(token, avatarUrl)
        }
    }
}