import WebSocket from "ws"
import UserData from "./UserData"
import crypto from "crypto"

export default class Player {
    id: string
    #websocket: WebSocket
    connected: boolean
    observing: boolean
    userData: UserData
    team: number
    #sessionId: string
    constructor(userdata: any, websocket: WebSocket, team: number, sessionId: string) {
        this.#websocket = websocket
        if (userdata.public_id != undefined) {
            this.id = userdata.public_id
        }
        else {
            this.id = crypto.randomBytes(5).toString("hex")
        }
        this.#sessionId = sessionId
        this.connected = true
        this.observing = false
        this.userData = userdata
        this.team = team
    }
    replaceUser(userdata: any) {
        if (userdata.public_id === undefined || userdata.public_id === this.id) {
            return
        }
        this.userData = userdata
    }
    kick() {
        this.#websocket.close()

    }
    send(strData: string) {
        this.#websocket.send(strData)
    }
    getSessionId() {
        return this.#sessionId
    }

    replace(newWs: WebSocket) {
        this.#websocket.send(JSON.stringify({ command: "WsClosed", reason: "Replaced" }))

        let webs: any = this.#websocket
        webs.replaced = true
        this.#websocket.close()
        this.#websocket = newWs
    }

}