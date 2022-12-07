import WebSocket = require("ws")
import { dispatchToken } from "../config"
import Dispatch from "../Dispatch"
import Log from "../utils/Log"

export default {
    "start": (json: any, ws: WebSocket) => {
        let webs = ws as any
        webs.game = json.game
        webs.path = json.path
        if (dispatchToken !== json.dispatchToken) {
            Log.warn("detected incorrect token while adding service", dispatchToken, "!==", webs.dispathToken)
            ws.close()
        }
        Dispatch.addService(webs.game, webs.path)
    }
}