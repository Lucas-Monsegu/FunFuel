import client from "prom-client"

export default class Metrics {
    static wsMessageCache = 0
    static activeRoom = new client.Gauge({
        name: "active_rooms",
        help: "Number of rooms",
        labelNames: ["code"]
    })
    static playersInGame = new client.Gauge({
        name: "players_in_game",
        help: "Number of players actually in game",
        labelNames: ["code"]
    })
    static closedRoom = new client.Counter({
        name: "closed_games",
        help: "Number of game that are destroyed",
        labelNames: ["code"],
    })
    static playedGames = new client.Counter({
        name: "played_games",
        help: "Number of games played",
        labelNames: ["code"],
    })
    static totalLengthOfGames = new client.Counter({
        name: "total_game_length",
        help: "longueur total des games en secondes",
        labelNames: ["code"],
    })
    static messageReceived = new client.Counter({
        name: "messageReceived",
        help: "Number of websocket message received",
        labelNames: ["code"],
    })
    static addActiveRoom() {
        this.activeRoom.inc(1)
    }
    static gameFinished(seconds: number) {
        this.playedGames.inc(1)
        this.totalLengthOfGames.inc(seconds)
    }
    static removeActiveRoom() {
        this.activeRoom.dec(1)
        this.closedRoom.inc(1)
    }
    static addPlayer() {
        this.playersInGame.inc(1)
    }
    static removePlayer() {
        this.playersInGame.dec(1)
    }
    static receivedMessage() {
        this.wsMessageCache += 1
        if (this.wsMessageCache > 100) {
            this.messageReceived.inc(this.wsMessageCache)
            this.wsMessageCache = 0
        }
    }
    static reset() {
        this.messageReceived.reset()
        this.totalLengthOfGames.reset()
        this.playedGames.reset()
        this.closedRoom.reset()
    }
}