import Room from "./Room"
import { Lobby } from "../../game/Lobby"
import CreateRoomInterface from "../interfaces/CreateRoomInterface"
import Metrics from "../metrics/Metrics"

export default class Manager {
    static roomList: { [key: string]: Lobby } = {}
    static createLobby(command: CreateRoomInterface, token: string) {
        const lobby = new Lobby(command.name, command.password, command.maxPlayers, token)
        this.roomList[token] = lobby
        Metrics.addActiveRoom()
    }
    static deleteLobby(token: string) {
        delete this.roomList[token]
        Metrics.removeActiveRoom()
    }
    static getLobby(token: string) {
        return this.roomList[token]
    }
}