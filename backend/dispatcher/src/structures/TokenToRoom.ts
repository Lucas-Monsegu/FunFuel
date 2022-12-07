import Room from "../models/Room"
import Log from "../utils/Log"
import Service from "../models/Service"

export default class TokenToRoom {
    private static table: { [key: string]: Room } = {}

    static add(token: string, room: Room) {
        if (token in this.table) {
            return Log.warn("TokenToRoom: Collision error")
        }
        this.table[token] = room
    }

    static delete(token: string) {
        delete this.table[token]
    }
    static deleteGamesOfService(service: Service) {
        for (let token in this.table) {
            if (this.table[token].service === service) {
                this.delete(token)
            }
        }
    }

    static get(token: string): Room | undefined {
        return this.table[token]

    }
}
