import Room from "../base/lobby/Room"
import Player from "../base/lobby/Player"
import LobbyInterface from "../base/lobby/LobbyInterface"
import WebSocket = require("ws")
import PlayerInfos from "./PlayerInfos"
import Role from "./Roles"
import Random from "../base/utils/Random"
import Words from "./Words"
import Master from "../base/utils/Master"

//Copy and paste this file to start quickly
//Do not forget to change the path of lobby in manager to be yours
export class Lobby extends Room implements LobbyInterface {
    protected gameName: string = "mentalist"

    teams: Array<Array<string>>
    teamsNames: Array<string>
    playersInfos: { [key: string]: PlayerInfos }
    currentTurn: any
    msPerTurn: number
    gameGen: Generator<void> | undefined
    msPerVote: number
    numberOfMrWhite: number
    numberOfUnderCover: number
    words: [string, string]
    gameFinished: boolean = false
    winners: string[] | undefined
    voting: boolean
    currentTalking: string | undefined = undefined
    numberOfCivilians: number = 0
    timeInfo: number = 0
    language: string
    default: boolean
    mrWhiteLastWord: boolean = false
    playerstarting: number

    constructor(name: string, password: string, maxPlayers: number, token: string) {
        super(name, password, maxPlayers, token)
        this.teams = [[]] // Add an array for every number of teams needed for the game
        this.teamsNames = ["FreeForAll"] //Add a teamName for every teams
        this.playersInfos = {}
        this.currentTurn = undefined
        this.gameGen = undefined
        this.voting = false
        this.playerstarting = 0
        //OPTIONS
        this.msPerTurn = 20000
        this.msPerVote = 30000
        this.numberOfMrWhite = 0
        this.numberOfUnderCover = 0
        this.language = "english"
        this.default = true
        this.words = ["", ""]

    }

    protected deleteGame(): void {
        this.gameGen = undefined
        this.currentTurn = undefined
    }

    ConfigOptions() {
        let numberOfCivilian = 0
        let n = this.getNumberOfPlayers()
        this.started = true

        if (this.numberOfMrWhite === 0 && this.numberOfUnderCover === 0) {
            numberOfCivilian = Math.floor(n / 2) + 1
            this.numberOfUnderCover = Math.round(2 * (n - numberOfCivilian) / 3)
            this.numberOfMrWhite = n - numberOfCivilian - this.numberOfUnderCover
        }
        else {
            numberOfCivilian = n - this.numberOfUnderCover - this.numberOfMrWhite
        }
        this.numberOfCivilians = numberOfCivilian
    }
    resetGame() {
        this.playersInfos = {}
        this.timeInfo = 0
        this.currentTurn = undefined
        this.currentTurn = undefined
        this.gameGen = undefined
        this.voting = false
        this.mrWhiteLastWord = false
        this.numberOfCivilians = 0
        this.currentTalking = undefined
        this.winners = undefined
        this.gameGen = undefined
        this.voting = false
        this.gameFinished = false
        this.playerstarting = 0
        this.words = Words.getRandomWords(this.language)

    }
    async startGame() {
        this.resetGame()
        if (this.getNumberOfPlayers() <= 2) {
            this.sendAll({ command: "CantStart", reason: "Not enough players" })
            return false
        }
        if (this.numberOfUnderCover + this.numberOfMrWhite >= this.getNumberOfPlayers()) {
            this.sendAll({ command: "CantStart", reason: "Not enough players for those settings" })
            return false
        }
        this.ConfigOptions()
        let allRoles: Role[] = []
        for (let i = 0; i < this.numberOfCivilians; ++i) { allRoles.push(Role.CIVILIAN) }
        for (let i = 0; i < this.numberOfUnderCover; ++i) { allRoles.push(Role.UNDERCOVER) }
        for (let i = 0; i < this.numberOfMrWhite; ++i) { allRoles.push(Role.MRWHITE) }
        allRoles = Random.shuffeArray(allRoles)
        if (allRoles[0] === Role.MRWHITE) {
            let indices = []
            for (let i = 0; i < allRoles.length; ++i) {
                if (allRoles[i] != Role.MRWHITE) {
                    indices.push(i)
                }
            }
            let newindex = Random.fromArray(indices)
            let tmp = allRoles[0]
            allRoles[0] = allRoles[newindex]
            allRoles[newindex] = tmp
        }
        let i = 0
        for (const playersId of this.teams[0]) {
            this.playersInfos[playersId] = new PlayerInfos(playersId, allRoles[i], true, undefined, undefined)
            i += 1
        }

        this.gameGen = this.game()
        this.gameGen?.next()
        return true
    }
    getWordFromRole(role: Role) {
        switch (role) {
            case 1:
                return ""
            case 2:
                return this.words[1]
            default:
                return this.words[0]
        }
    }
    *game() {
        while (!this.gameFinished) {
            console.log(this.currentTurn)
            this.currentTurn = this.createTurn()
            this.currentTurn.next()
            if (!this.gameFinished) {
                this.gameFinished = this.IsGameFinished()
            }
            yield
        }

        this.sendWinners()
    }
    sendWinners() {
        if (this.winners !== undefined) {
            return
        }
        const alives = Object.values(this.playersInfos).filter(el => el.alive)
        const civilians = alives.filter(el => el.getRole() === Role.CIVILIAN).map(el => el.id)
        const mrwhites = alives.filter(el => el.getRole() === Role.MRWHITE).map(el => el.id)
        const undercovers = alives.filter(el => el.getRole() === Role.UNDERCOVER).map(el => el.id)
        let roleWin
        if (this.isCivilianWin()) {
            this.winners = civilians
            roleWin = Role.CIVILIAN
        }
        else if (this.isMrWhiteWin()) {
            this.winners = mrwhites
            roleWin = Role.MRWHITE
        }
        else {
            roleWin = Role.UNDERCOVER
            this.winners = undercovers
        }
        this.gameGen = undefined
        this.currentTurn = undefined
        this.gameEnd(roleWin)
    }

    gameEnd(role: Number) {
        this.sendAll({ command: 'RoleWin', role: role })

        const allRoles: { [key: string]: number } = {}
        Object.keys(this.playersInfos).forEach(playerId => {
            allRoles[playerId] = this.playersInfos[playerId].getRole()
        })
        setTimeout(() => {
            this.sendAll({ command: "GameEnd", winners: this.winners, role: Role.UNDERCOVER, allRoles: allRoles })
            this.endGame(this.winners !== undefined ? this.winners : [], this.teams[0])

        }, 3000)
    }

    *createTurn() {
        this.voting = false
        this.sendAll({ command: "Phase", phase: "talk" })
        const p = Object.keys(this.playersInfos)
        const playersOrder = p.slice(this.playerstarting).concat(p.slice(0, this.playerstarting))
        for (const playerTurn of playersOrder) {
            this.currentTalking = playerTurn
            if (!this.playersInfos[playerTurn].alive) {
                continue
            }
            this.sendAll({ command: "Talk", player: playerTurn })
            const timeout = setTimeout(() => { this.currentTurn?.next(["word", "pass", playerTurn]) }, this.msPerTurn)
            this.timeInfo = Date.now() + this.msPerTurn
            let word, player
            do {
                let t = yield
                console.log('talk')
                if (t[0] !== "word") {
                    continue
                }
                word = t[1]
                player = t[2]
            } while (player !== playerTurn)
            clearTimeout(timeout)
            this.playersInfos[playerTurn].word = word
            this.playersInfos[playerTurn].history.push(word)
            this.sendAll({ command: "Word", player: player, word: word, history: this.playersInfos[playerTurn].history })
        }
        //Send chose eliminate player
        console.log("elimanting player start")
        this.sendAll({ command: "Phase", phase: "vote" })

        setTimeout(() => { this.currentTurn?.next(["wait"]) }, 1500)
        let t = undefined
        do {
            t = yield [0]
        } while (t != "wait")
        let everyoneVoted = false
        this.voting = true
        this.currentTalking = undefined
        const timeout = setTimeout(() => { this.currentTurn?.next(["voted"]) }, this.msPerVote)
        this.timeInfo = Date.now() + this.msPerVote

        do {
            const t = yield
            if (t[0] == "voted") {
                everyoneVoted = true
            }
        } while (!everyoneVoted)
        clearTimeout(timeout)
        const votedPlayer: string = this.getVotedPlayer()
        this.playerstarting = Object.keys(this.playersInfos).indexOf(votedPlayer)
        console.log("player eliminated", votedPlayer)
        if (this.playersInfos[votedPlayer].getRole() === Role.MRWHITE) {
            let mrwhiteWord: string
            this.sendAll({ command: "MentalistAnim", player: votedPlayer })
            const t = setTimeout(() => { this.currentTurn?.next(["mrwhitesay", votedPlayer, ""]) }, this.msPerTurn + 3000)
            this.timeInfo = Date.now() + this.msPerTurn
            this.mrWhiteLastWord = true
            do {
                // [mrwhitesay, votedplayer, word]
                const t = yield
                if (t[0] !== "mrwhitesay" || t[1] !== votedPlayer) {
                    continue
                }
                mrwhiteWord = t[2]
                break
            } while (true)
            this.mrWhiteLastWord = false
            if (mrwhiteWord.toLowerCase() === this.words[0]) {
                this.MrWhiteEndGame(votedPlayer)
                return
            }

        }
        this.EliminatePlayer(votedPlayer, this.playersInfos[votedPlayer].getRole() === Role.MRWHITE)
        setTimeout(() => { this.currentTurn?.next(["wait"]) }, 3500)
        let t2 = undefined
        do {
            t2 = yield [0]
        } while (t2 != "wait")

        this.resetVote()
        this.gameGen?.next()
    }
    IsGameFinished() {
        return this.isCivilianWin() || this.isUnderCoverAndMrWhiteWin()
    }
    MrWhiteEndGame(winner: string) {
        this.winners = [winner]
        this.gameEnd(Role.MRWHITE)
        this.gameFinished = true
        this.gameGen = undefined
        this.currentTurn = undefined
    }

    isCivilianWin() {
        const alives = Object.values(this.playersInfos).filter(el => el.alive)
        return alives.every(e => e.getRole() === Role.CIVILIAN)
    }
    isMrWhiteWin() {
        const alives = Object.values(this.playersInfos).filter(el => el.alive)
        return alives.map(e => Number(e.getRole() !== Role.MRWHITE)).reduce((a, b) => a + b) <= 1 && alives.some(e => e.getRole() === Role.MRWHITE)
    }
    isUnderCoverAndMrWhiteWin() {
        const alives = Object.values(this.playersInfos).filter(el => el.alive)
        return alives.map(e => Number(e.getRole() === Role.CIVILIAN)).reduce((a, b) => a + b) <= 1
    }


    checkEndVote() {
        const alives = Object.values(this.playersInfos).filter(el => el.alive)
        const everyoneVoted = !(Object.values(alives).some(el => el.vote === undefined))
        console.log(everyoneVoted, alives)
        if (everyoneVoted) {
            this.currentTurn?.next(["voted"])
        }
    }

    getVotedPlayer() {
        const hist: { [key: string]: number } = {}
        for (const playerId of Object.keys(this.playersInfos)) {
            const vote = this.playersInfos[playerId].vote
            if (vote === undefined || vote === "") {
                continue
            }
            if (hist[vote] === undefined) {
                hist[vote] = 0
            }
            hist[vote] += 1
        }
        console.log("hist", hist)
        if (hist.length === 0) {
            console.log(Object.entries(this.playersInfos).filter((a) => a[1].alive).map(el => el[0]))
            return Random.fromArray(Object.entries(this.playersInfos).filter((a) => a[1].alive).map(el => el[0]))
        }
        let histMax = 0
        for (let val of Object.values(hist)) {
            histMax = Math.max(histMax, val)
        }
        console.log("histmax", histMax)

        if (histMax === 0) {
            return Random.fromArray(Object.values(this.playersInfos).filter(el => el.alive).map(el => el.id))
        }
        const voteds = Object.values(this.playersInfos).filter(el => hist[el.id] === histMax).map(el => el.id)
        console.log(voteds)
        return Random.fromArray(voteds)
    }

    EliminatePlayer(eliminatedPlayer: string, noAnim: boolean = false) {
        this.playersInfos[eliminatedPlayer].alive = false
        this.sendAll({ command: "EliminatePlayer", player: eliminatedPlayer, role: this.playersInfos[eliminatedPlayer].getRole(), noanim: noAnim })

        if (this.IsGameFinished()) {
            setTimeout(_ => { this.sendWinners() }, 3000)
        }
    }
    resetVote() {
        for (const playerId in this.playersInfos) {
            this.playersInfos[playerId].vote = undefined
        }
    }



    // COMMAND
    @Master
    SetOptions(data: any, player: Player) {
        this.msPerTurn = data.msPerTurn
        this.msPerVote = data.msPerVote
        this.language = data.language
        this.default = data.default
        if (data.default) {
            this.numberOfUnderCover = 0
            this.numberOfMrWhite = 0
        }
        else {
            this.numberOfUnderCover = data.doubleagents
            this.numberOfMrWhite = data.mentalists
        }
        this.sendAll({ command: "GetOptions", msPerTurn: this.msPerTurn, msPerVote: this.msPerVote, default: this.default, doubleagents: this.numberOfUnderCover, mentalists: this.numberOfMrWhite, language: this.language })

    }
    GetOptions(data: any, player: Player) {
        this.sendSingle({ command: "GetOptions", msPerTurn: this.msPerTurn, msPerVote: this.msPerVote, default: this.default, doubleagents: this.numberOfUnderCover, mentalists: this.numberOfMrWhite, language: this.language }, player.id)
    }
    GetStateOfTheGame(data: any, player: Player) {
        console.log("playersInfos", this.playersInfos)
        let timeleft = this.timeInfo - Date.now()
        timeleft = timeleft < 0 ? 0 : timeleft
        let word = undefined
        if (this.teams[0].includes(player.id)) {
            word = this.getWordFromRole(this.playersInfos[player.id]?.getRole())
        }
        this.sendSingle({ command: "GetStateOfTheGame", playersInfos: this.playersInfos, talking: this.currentTalking, voting: this.voting, timeleft: timeleft, word: word }, player.id)
    }
    ResetGame(data: any, player: Player) {

    }

    SendWord(data: any, player: Player) {
        const word: string = data.word
        if (this.voting || !this.playersInfos[player.id].alive) {
            return
        }
        this.currentTurn?.next(["word", word, player.id])
    }
    Vote(data: any, player: Player) {
        const votedPlayer: string = data.voted
        console.log("in vote", this.voting)
        if (this.getPlayer(votedPlayer) === null || !this.voting || !this.playersInfos[player.id].alive) {
            return
        }
        this.playersInfos[player.id].vote = votedPlayer
        this.sendAll({ command: "Vote", player: player.id, playerVoted: votedPlayer })
        this.checkEndVote()
    }
    VoteIntent(data: any, player: Player) {
        if (!this.voting || !this.playersInfos[player.id].alive) {
            return
        }
        this.sendAll({ command: "VoteIntent", vote: data.intent, player: player.id })
    }

    MrWhiteQuickSay(data: any, player: Player) {
        if (!(player.id in this.playersInfos) || this.playersInfos[player.id].getRole() !== Role.MRWHITE || !this.playersInfos[player.id].alive) {
            return
        }
        this.sendAll({ command: "MentalistGuess", word: data.word, player: player.id })
        if (this.mrWhiteLastWord) {
            this.currentTurn?.next(["mrwhitesay", player.id, data.word])
            return
        }
        if (data.word === this.words[0]) {
            this.MrWhiteEndGame(player.id)
        }
        else {
            this.EliminatePlayer(player.id, true)
        }
    }
}
