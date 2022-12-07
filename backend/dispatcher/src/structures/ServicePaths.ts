import Service from "../models/Service"
import Room from "../models/Room"
import { addService as promAddService, deleteService as promDeleteService } from "../utils/jsonEdit"
import Log from "../utils/Log"

export default class ServicePaths {
    private static gameTable: { [key: string]: Array<Service> } = {}

    static addService(game: string, path: string): boolean {
        Log.info("service created:", game, path)
        if (!(game in this.gameTable)) {
            this.gameTable[game] = []
        }
        if (this.gameTable[game].map(s => s.path).includes(path)) {
            Log.debug("ServicePaths: Service re-added")
            return false
        }
        this.gameTable[game].push(new Service(path, game))
        promAddService(game, path)
        return true
    }

    static getServiceFromPath(game: string, path: string) {
        if (!(game in this.gameTable)) {
            Log.error("trying to get service from path but failed", path, game, this.gameTable)
            return
        }
        return this.gameTable[game].find((s: Service) => {
            return s.path === path
        })
    }

    static deleteService(game: string, path: string) {
        if (!(game in this.gameTable)) {
            return
        }
        let list = this.gameTable[game].map(s => s.path)
        if (!list.includes(path)) {
            return
        }
        let index = list.indexOf(path)
        this.gameTable[game].splice(index, 1)
        promDeleteService(game, path)
    }

    static getBalancedService(game: string): Service | null {
        let min = Number.MAX_SAFE_INTEGER
        let smin: Service | null = null
        if (!this.gameTable[game]) {
            return null
        }
        for (const service of this.gameTable[game]) {
            if (service.playersInGame < min) {
                min = service.playersInGame
                smin = service
            }
        }
        return smin
    }
}