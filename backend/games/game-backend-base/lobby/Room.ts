import Player from "./Player"
import Metrics from "../metrics/Metrics"
import WebSocket = require("ws")
import Manager from "./Manager"
import Log from "../utils/Log"
import Dispatcher from "../inter_services/Dispatcher"
import Master from "../utils/Master"
import Random from "../utils/Random"
import Jfetch from "../utils/Jfetch"
import { mainUrl, dispatchToken } from "../../config"

export default abstract class Room {
    name: string
    players: { [key: string]: Player }
    password: string
    maxPlayers: number
    master: string | null
    started: boolean
    token: string
    startTime: number | null
    observers: { [key: string]: Player } = {}

    protected abstract teamsNames: Array<string>
    protected abstract teams: Array<Array<string>>
    protected abstract GetOptions(data: any, player: Player): void
    protected abstract GetStateOfTheGame(data: any, player: Player): void
    protected async abstract startGame(): Promise<boolean>
    protected abstract ResetGame(data: any, player: Player): void
    constructor(name: string, password: string, maxPlayers: number, token: string) {
        this.name = name
        this.players = {}
        this.token = token
        this.password = password
        this.maxPlayers = maxPlayers
        this.master = null
        this.started = false
        this.startTime = null
    }


    //#region BASE

    endGame(winners: string[], allPlayers: string[]) {
        this.started = false
        if (this.startTime == null) {
            Log.warn("game finished but not started")
            return
        }
        const timeInGame = (Date.now() - this.startTime) / 1000
        console.log('winners:', winners)
        console.log('players: ', allPlayers)
        Jfetch.post(`${mainUrl}/endgame-xp`, {
            token: dispatchToken,
            winners: winners,
            seconds: timeInGame,
            players: allPlayers
        }).then(res => {
            res.json().then(obj => {
                if (obj['error']) {
                    allPlayers.forEach(p => {
                        this.sendSingle({ command: 'Error', reason: 'Unexpected error while adding xp' }, p)
                    })
                }
                else {
                    allPlayers.forEach(p => {
                        if (obj['xpInfos'][p] === undefined) {
                            this.sendSingle({ command: 'NotLogged', }, p)
                        }
                        else {
                            if (obj['newItems'] !== undefined && obj['newItems'][p] !== undefined) {
                                this.sendSingle({ command: 'ReceiveXp', xpInfo: obj['xpInfos'][p], newItem: obj['newItems'][p] }, p)
                            }
                            else {
                                this.sendSingle({ command: 'ReceiveXp', xpInfo: obj['xpInfos'][p] }, p)
                            }
                        }
                    })
                }
                console.log('error ?', obj['error'])
                console.log('results: ', obj['xpInfos'])
            })
        })
        Metrics.gameFinished(timeInGame)

    }
    getNumberOfPlayers() {
        return Object.keys(this.players).length
    }

    checkPassword(password: string) {
        return this.password == password
    }
    isFull() {
        return Object.keys(this.players).length >= this.maxPlayers
    }
    numberOfPlayers() {
        return Object.keys(this.players).length
    }
    isPrivate() {
        return this.password != ""
    }

    getTeamWithLessPlayers(): number {
        let m = 0
        if (this.teams.length <= 1) {
            return 0
        }
        for (let i = 1; i < this.teams.length; ++i) {
            if (this.teams[m].length > this.teams[i].length) {
                m = i
            }
        }
        return m

    }
    getPlayerFromSessionId(sessionId: string) {
        return Object.values(this.players).find(player => player.getSessionId() === sessionId)
    }

    addPlayer(userData: any, ws: WebSocket, sessionId: string) {
        if (this.isFull()) {
            ws.send(JSON.stringify({ command: "ServerIsFull" }))
        }
        const newTeamIndex = this.getTeamWithLessPlayers()
        const player = new Player(userData, ws, newTeamIndex, sessionId)
        if (this.started) {
            player.observing = true
            this.observers[player.id] = player
            console.log("IN THIS STARTED AND SENDING INFOS")
            this.sendSingle({ command: "PlayersInfos", infos: this.players, maxPlayers: this.maxPlayers, master: this.master }, player.id)
            this.sendSingle({ command: "TeamInfo", names: this.teamsNames, players: this.teams, randomized: false }, player.id)
            this.sendSingle({ command: "Connected", sessionId: sessionId, publicId: player.id, roomName: this.name }, player.id)
            return player
        }
        this.players[player.id] = player
        this.teams[newTeamIndex].push(player.id)
        this.sendSingle({ command: "Connected", sessionId: sessionId, publicId: player.id, roomName: this.name }, player.id)
        if (this.master == null) {
            this.electNewMaster()
        }
        this.sendPlayersInfos()
        this.sendTeamInfos()

        Dispatcher.updateRooms(this.token, this.numberOfPlayers())
        Metrics.addPlayer()
        return player
    }
    kickObserver(player: Player) {
        if (!(player.id in this.observers)) {
            return
        }
        delete this.observers[player.id]
        player.kick()
    }
    kickPlayer(playerId: string) {
        const team = this.getPlayerTeam(playerId)
        if (team === null) {
            return
        }
        const playerIndex = this.teams[team].indexOf(playerId)
        if (playerIndex < 0) {
            console.error(`Player is already removed from team:${team}, player: ${playerId}`)
        }

        this.players[playerId].kick()
        this.teams[team].splice(playerIndex, 1)
        delete this.players[playerId]
        if (this.getNumberOfPlayers() === 0) {
            Manager.deleteLobby(this.token)
            Dispatcher.deleteRoom(this.token)
            Metrics.removePlayer()
            return
        }
        if (this.master === playerId) {
            this.electNewMaster()
        }

        this.sendTeamInfos()
        this.sendPlayersInfos()

        Dispatcher.updateRooms(this.token, this.numberOfPlayers())
        Metrics.removePlayer()
    }
    disconnectPlayer(player: Player) {
        Log.debug("in disconnect player", player.connected)
        if (!player.connected) {
            return
        }
        if (player.observing) {
            this.kickObserver(player)
        }
        if (!this.started) {
            this.kickPlayer(player.id)
            return
        }

        player.connected = false
        Log.debug("not connected")
        if (player.id === this.master) {
            Log.debug("is master")
            this.electNewMaster()
        }
    }

    getPlayerTeam(playerId: string) {
        const r = this.getPlayer(playerId)
        if (r != null) {
            return r.team
        }
        return r
    }
    getPlayer(playerId: string): Player | null {
        if (!(playerId in this.players)) {
            return null
        }
        return this.players[playerId]
    }
    getObserver(playerId: string): Player | null {
        if (!(playerId in this.observers)) {
            return null
        }
        return this.observers[playerId]
    }
    electNewMaster() {
        let playerTab = Object.values(this.players).filter(p => { return p.connected })
        if (playerTab.length == 0) {
            this.master = null
            Log.debug("delete the lobby")
            Manager.deleteLobby(this.token)
            Dispatcher.deleteRoom(this.token)
            return
        }
        let max = playerTab.length
        let r = Math.floor(Math.random() * max)
        const masterPlayer = playerTab[r]
        this.master = masterPlayer.id
        Dispatcher.newMaster(this.token, masterPlayer.userData.avatar)
        Log.debug("new Master elected:", this.master)
    }


    sendPlayersInfos() {
        this.sendAll({ command: "PlayersInfos", infos: this.players, maxPlayers: this.maxPlayers, master: this.master })
    }
    sendTeamInfos(randomizeAnimation: boolean = false) {
        this.sendAll({ command: "TeamInfo", names: this.teamsNames, players: this.teams, randomized: randomizeAnimation })
    }

    sendAll(data: Object, exclude: string | undefined = undefined) {
        const strData = JSON.stringify(data)
        Object.values(this.players).forEach((player: Player) => {
            if (player.id != exclude) {
                player.send(strData)
            }
        })
        Object.values(this.observers).forEach((player: Player) => {
            if (player.id != exclude) {
                player.send(strData)
            }
        })
    }
    sendTeam(data: Object, teamIndex: number) {
        const strData = JSON.stringify(data)
        if (teamIndex < 0 || teamIndex >= this.teams.length) {
            throw `Sending to an non-existing team ${teamIndex}`
        }
        this.teams[teamIndex].forEach((playerId: string) => {
            this.getPlayer(playerId)?.send(strData)
        })
    }
    sendSingle(data: Object, playerId: string) {
        const strData = JSON.stringify(data)
        if (playerId in this.observers) {
            this.getObserver(playerId)?.send(strData)
            return
        }
        this.getPlayer(playerId)?.send(strData)
    }

    //#endregion

    //#region COMMANDS
    @Master
    RandomizeTeams(data: any, player: Player) {
        Log.debug("in randomize team")
        for (let i = 0; i < this.teams.length; ++i) {
            this.teams[i].length = 0
        }
        let ids = Random.shuffeArray(Object.keys(this.players))
        let numberOfTeam = this.teams.length
        let randomRange = Random.shuffeArray(Array.from(Array(numberOfTeam).keys()))
        for (let i = 0; i < ids.length; ++i) {
            const newTeam = randomRange[i % numberOfTeam]
            this.teams[newTeam].push(ids[i])
            let p = this.getPlayer(ids[i])
            if (p !== null) {
                p.team = newTeam
            }
        }
        this.sendTeamInfos(true)
    }
    @Master
    Kick(data: any, player: Player) {
        if (!this.getPlayer(data.playerId)) {
            return
        }
        this.sendSingle({ command: "WsClosed", reason: "Kicked" }, data.playerId)
        this.kickPlayer(data.playerId)
    }
    @Master
    ChangePlayerTeamAdmin(data: any, player: Player) {
        const movedPlayer = this.getPlayer(data.playerId)
        if (!movedPlayer)
            return
        const currentTeamIndex = this.getPlayerTeam(data.playerId)
        if (currentTeamIndex === null) {
            return
        }
        const newTeamIndex = data.newTeam
        const currentTeam = this.teams[currentTeamIndex]
        const index = currentTeam.indexOf(data.playerId)
        if (index <= -1) {
            return
        }
        currentTeam.splice(index, 1)
        this.teams[newTeamIndex].splice(data.newPosition, 0, data.playerId)
        movedPlayer.team = newTeamIndex
        this.sendTeamInfos()
    }

    @Master
    async Play(data: any, player: Player) {
        this.startTime = Date.now()
        if (await this.startGame()) {
            this.sendAll({ command: "Play" })

        }

    }

    Join(data: any, player: Player) {
        this.sendSingle({ command: "IsGameStarted", started: this.started }, player.id)
        this.GetOptions(data, player)
    }

    ChangePlayerName(data: any, player: Player) {
        player.userData.username = data.username.substring(0, 25)
        this.sendPlayersInfos()
    }
    ChangeTeamName(data: any, player: Player) {
        const teamIndex = this.getPlayerTeam(player.id)
        if (teamIndex === null) {
            return
        }
        this.teamsNames[teamIndex] = data.substring(0, 25)
        this.sendTeamInfos()
    }
    ChangePlayerTeam(data: any, player: Player) {
        const currentTeamIndex = this.getPlayerTeam(player.id)
        if (currentTeamIndex === null) {
            return
        }
        const newTeamIndex = data.newTeam
        if (currentTeamIndex == newTeamIndex) {
            return
        }
        const currentTeam = this.teams[currentTeamIndex]

        const index = currentTeam.indexOf(player.id)
        if (index <= -1) {
            return
        }
        currentTeam.splice(index, 1)
        this.teams[newTeamIndex].push(player.id)
        player.team = newTeamIndex
        this.sendTeamInfos()
    }

    //#endregion
}