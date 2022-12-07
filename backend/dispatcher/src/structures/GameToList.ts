import Room from "../models/Room"
import Log from "../utils/Log"
import Service from "../models/Service"

export default class GameToList {
    private static table: { [key: string]: Array<Room> } = {}

    static get(game: string) {
        if (this.table[game] == undefined) {
            return []
        }
        return this.table[game].map((el) => { return el.getJson() })
    }
    static add(game: string, room: Room): boolean {
        if (!(game in this.table)) {
            this.table[game] = []
        }
        if (this.table[game].includes(room)) {
            Log.warn("GameToList : Unexpected Collision")
            return false
        }
        this.table[game].push(room)
        console.log("GAMETOLIST TABLE", this.table)
        return true
    }

    static delete(game: string, room: Room) {
        let list = this.table[game]
        list.splice(list.indexOf(room), 1)
    }
    static deleteFromService(game: string, service: Service) {
        console.log(this.table)
        const li = this.table[game]
        if (!li) {
            Log.error("fail to delete game to list from service", this.table, game)
            return
        }
        this.table[game] = li.filter(el => { return el.service !== service })
    }
}