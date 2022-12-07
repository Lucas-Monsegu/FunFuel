import start from "./start"
import room from "./room"
import WebSocket = require("ws")

const commands: { [key: string]: (json: any, ws: WebSocket) => void } = {
    ...start,
    ...room
}

export default commands