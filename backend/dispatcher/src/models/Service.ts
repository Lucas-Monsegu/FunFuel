import Log from "../utils/Log"

export default class Service {
    path: string
    playersInGame: number = 0
    game: string
    constructor(path: string, game: string) {
        this.path = path
        this.game = game
    }
    updatePlayers(difference: number) {
        this.playersInGame += difference
        Log.info(this.path, "has", this.playersInGame, "players")
    }
}