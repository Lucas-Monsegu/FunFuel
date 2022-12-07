import Service from "./Service"
import Log from "../utils/Log"

export default class Room {
    currentNumberOfPlayers: number = 0
    service: Service
    public: boolean
    avatarUrl: string
    name: string
    token: string
    colorIndex: number
    maxPlayers: number

    constructor(service: Service, pub: boolean, name: string, maxPlayers: number, token: string) {
        this.service = service
        this.public = pub
        this.name = name
        this.token = token
        this.colorIndex = Math.floor(Math.random() * 8)
        this.maxPlayers = maxPlayers
        this.avatarUrl = String.fromCharCode(0)
    }
    updatePlayers(players: number) {
        const diff = players - this.currentNumberOfPlayers
        this.currentNumberOfPlayers = players
        this.service.updatePlayers(diff)
    }
    newMaster(avatarUrl: string) {
        console.log("new Master change avatarUrl:", avatarUrl)
        this.avatarUrl = avatarUrl
    }
    getJson() {
        // Log.debug(typeof this.maxPlayers)
        return {
            players: this.currentNumberOfPlayers,
            isPublic: this.public,
            name: this.name,
            token: this.token,
            avatarUrl: this.avatarUrl,
            path: this.service.path,
            colorIndex: this.colorIndex,
            maxPlayers: this.maxPlayers
        }
    }
}