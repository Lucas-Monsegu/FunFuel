import TokenToRoom from "./structures/TokenToRoom"
import ServicePaths from "./structures/ServicePaths"
import GameToList from "./structures/GameToList"
import Room from "./models/Room"
import crypto from "crypto"
import Service from "./models/Service"
import Log from "./utils/Log"

export default class Dispatch {
    static connect(token: string): Room | undefined {
        return TokenToRoom.get(token)
    }

    static createRoom(service: Service, game: string, isPublic: boolean, name: string, maxPlayers: number): string {
        if (service == null) {
            throw "No service available for this game"
        }
        const token = crypto.randomBytes(5).toString("hex")
        let room = new Room(service, isPublic, name, maxPlayers, token)
        TokenToRoom.add(token, room)
        GameToList.add(game, room)
        return token
    }
    static getBalancedService(game: string) {
        return ServicePaths.getBalancedService(game)
    }
    static getServiceFromPath(game: string, path: string) {
        return ServicePaths.getServiceFromPath(game, path)
    }

    static updateRoom(token: string, numberPlayers: number) {
        const room = TokenToRoom.get(token)
        Log.debug(token, room)
        room?.updatePlayers(numberPlayers)
    }
    static newMaster(token: string, avatarUrl: string) {
        const room = TokenToRoom.get(token)
        room?.newMaster(avatarUrl)
    }

    static deleteRoom(game: string, token: string) {
        let room = TokenToRoom.get(token)
        if (!room) {
            return
        }
        GameToList.delete(game, room)
        TokenToRoom.delete(token)
        room.updatePlayers(0)
    }

    static addService(game: string, path: string): boolean {
        return ServicePaths.addService(game, path)
    }
    static deleteService(game: string, path: string) {
        const service = ServicePaths.getServiceFromPath(game, path)
        if (!service) {
            return
        }
        TokenToRoom.deleteGamesOfService(service)
        GameToList.deleteFromService(game, service)
        ServicePaths.deleteService(game, path)
    }

    static getRoomList(game: string) {
        return GameToList.get(game)
    }
}