import Room from "../base/lobby/Room"
import Player from "../base/lobby/Player"
import LobbyInterface from "../base/lobby/LobbyInterface"
import Master from "../base/utils/Master"
import NoObs from "../base/utils/NoObs"
import PostPlayList from "./PlayListManager"
import PlayListManager from "./PlayListManager"
import Jfetch from "../base/utils/Jfetch"
import Random from "../base/utils/Random"
import PointCounter from "./PointCounter"
import levenshtein from 'js-levenshtein'

//Copy and paste this file to start quickly
//Do not forget to change the path of lobby in manager to be yours
export class Lobby extends Room {
    protected gameName: string = 'blindTest'
    teams: Array<Array<string>>
    teamsNames: Array<string>

    points: { [key: string]: number }
    lastTry: { [key: string]: string }
    currentGame: any = undefined
    allSongs: Array<[string, string, string, number]> = []
    currentSong: [string, string, string, number] = ['', '', '', 0] //[answer, playlistname, answertype, song]
    pointCounter: PointCounter = new PointCounter()
    songStartTime: number = 0
    currentSongNumber: number = 0
    maxSongs: number = 0
    antiSpam: { [key: string]: number } = {}

    numberOfSongs: number
    playLists: Array<string>
    constructor(name: string, password: string, maxPlayers: number, token: string) {
        super(name, password, maxPlayers, token)
        this.teams = [[]] // Add an array for every number of teams needed for the game
        this.teamsNames = ["FreeForAll"] //Add a teamName for every teams
        this.points = {}
        this.lastTry = {}
        //OPTIONS
        this.numberOfSongs = 15
        this.playLists = []
    }
    deleteGame() {
        console.log('in delete game')
        this.currentGame = null
        this.points = {}
        this.numberOfSongs = 0
    }

    async getPlayListsData() {
        try {
            this.allSongs = []
            console.log('playlists', this.playLists)
            const responses = await Promise.all(this.playLists.map((playList) => { return Jfetch.get(`https://funfuelbucket.s3.amazonaws.com/blindtest/${playList}/index.json`).then(response => response.json()) }))
            for (let playList of responses) {
                this.allSongs = this.allSongs.concat(playList)
            }
            console.log('done getplaylist', this.allSongs)
            return true
        } catch (error) {
            console.log(error)
            return false
        }

    }



    *game() {
        console.log('all songs', this.allSongs, 'stop')
        for (let songIndex = 0; songIndex < this.numberOfSongs; ++songIndex) {
            if (this.allSongs.length <= 0) {
                break
            }
            this.currentSongNumber = songIndex + 1
            this.currentSong = Random.fromArray(this.allSongs)
            this.allSongs.splice(this.allSongs.indexOf(this.currentSong), 1)
            this.pointCounter.reset(this.teams[0].length)
            this.antiSpam = {}
            this.sendAll({ command: 'NewSong', playListName: this.currentSong[1], answerType: this.currentSong[2], song: this.currentSong[3], currentSong: this.currentSongNumber })
            this.songStartTime = Date.now()
            let stop = false
            const validator: { [key: string]: boolean } = {}
            for (let playerId of this.teams[0]) {
                validator[playerId] = false
            }
            const timeout = setTimeout(() => this.currentGame?.next('timeout'), 30500)
            do {
                const answer = yield
                if (answer === 'timeout') {
                    stop = true
                }
                else {
                    if (validator[answer]) {
                        continue
                    }
                    this.goodAnswer(answer)
                    validator[answer] = true
                    stop = Object.values(validator).every((el) => el)
                }
            } while (!stop)
            clearTimeout(timeout)
            this.sendAll({ command: 'Result', goodAnswer: this.currentSong[0] })
            stop = false
            const timeout2 = setTimeout(() => this.currentGame?.next('timeoutGoodAnswer'), 5000)
            do {
                console.log(this.currentGame)
                const answer = yield
                console.log('answer')
                if (answer === 'timeoutGoodAnswer') {
                    stop = true
                }
            } while (!stop)
            clearTimeout(timeout2)
        }
        this.gameEnd()
    }
    gameEnd() {
        this.sendAll({ command: 'GameEnd', points: this.points })
        let allPlayers = this.teams[0]
        const maxPoints = Math.max(...Object.values(this.points))
        const winners = Object.keys(this.points).filter((player) => { return this.points[player] >= maxPoints })
        setTimeout(() => { this.endGame(winners, allPlayers) }, 1000)
    }

    async startGame() {
        if (this.playLists.length === 0) {
            this.sendAll({ command: "CantStart", reason: "Select at least 1 blind test" })
            return false
        }
        if (!(await this.getPlayListsData())) {
            this.sendAll({ command: 'StartError', reason: 'Can\'t start the game: Error with one of the blind tests' })
            return false
        }
        this.maxSongs = Math.min(this.numberOfSongs, this.allSongs.length)
        this.points = {}
        for (let playerId of this.teams[0]) {
            this.points[playerId] = 0
        }
        this.lastTry = {}
        for (let playerId of this.teams[0]) {
            this.lastTry[playerId] = ''
        }
        this.currentGame = this.game()
        console.log(this.currentGame)
        setTimeout(() => { this.currentGame?.next() }, 200)
        this.started = true
        return true
    }
    isBlocked(playerId: string) {
        if (this.antiSpam[playerId] === undefined) {
            this.antiSpam[playerId] = 0
        }
        if (this.antiSpam[playerId] >= 10) {
            return true
        }
        this.antiSpam[playerId] += 1
        return false
    }

    goodAnswer(playerId: string) {
        const added = this.pointCounter.getPoint()
        this.points[playerId] += added
        this.sendAll({ command: 'GoodAnswer', points: this.points, player: playerId, added: added })
    }
    checkGoodWord(lowerAnswer: string, lowerSong: string) {
        const answerWords = lowerAnswer.split(' ')
        const songWords = lowerSong.split(' ')
        let n = 0
        for (let word of answerWords) {
            if (songWords.includes(word)) {
                n += 1
            }
        }
        if (n === songWords.length) {
            return 1
        }
        if (n > 0 && n < 3) {
            return 0
        }
        if (n >= 3) {
            return 1
        }
        return -1
    }
    @NoObs
    Answer(data: any, player: Player) {
        if (this.isBlocked(player.id)) {
            this.sendSingle({ command: 'Spam', text: 'You used all your 10 tries' }, player.id)
            return
        }
        const lowerAnswer = data.answer.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        const lowerSong = this.currentSong[0].trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        const wordsRes = this.checkGoodWord(lowerAnswer, lowerSong)
        if (lowerAnswer === lowerSong || wordsRes === 1) {
            this.currentGame?.next(player.id)
            return
        }
        const leven = levenshtein(lowerAnswer, lowerSong)
        const lenLimit = Math.ceil(lowerSong.length / 10)
        if (leven <= lenLimit) {
            this.currentGame?.next(player.id)
            return
        }
        if (leven <= lenLimit + 1 || wordsRes === 0) {
            console.log(leven, lenLimit, wordsRes)
            this.sendSingle({ command: 'Almost', leven: leven, text: data.answer }, player.id)
        }
        else {
            this.sendAll({ command: 'Try', player: player.id, text: data.answer })
        }
    }

    @Master
    SetOptions(data: any, player: Player) {
        //Check data
        if (!Array.isArray(data.playLists)) {
            return
        }
        for (let playList of data.playLists) {
            if (typeof playList !== 'string') {
                return
            }
        }
        this.playLists = data.playLists
        this.numberOfSongs = data.numberOfSongs
        this.sendAll({ command: 'GetOptions', numberOfSongs: this.numberOfSongs, playLists: this.playLists })
    }

    IsBlocked(data: any, player: Player) {
        this.sendSingle({ command: 'IsBlocked', value: PlayListManager.isBlocked(player) }, player.id)
    }

    GetOptions(data: any, player: Player) {
        this.sendSingle({ command: 'GetOptions', numberOfSongs: this.numberOfSongs, playLists: this.playLists }, player.id)
    }
    GetStateOfTheGame(data: any, player: Player) {
        const remainingSec = Math.max(0, Math.round((30000 + this.songStartTime - Date.now()) / 1000))
        this.sendSingle({ command: 'GetStateOfTheGame', points: this.points, remainingSec: remainingSec, currentSong: this.currentSongNumber, playlistName: this.currentSong[1], answerType: this.currentSong[2], maxSongs: this.maxSongs }, player.id)
    }

    @Master
    async CreatePlayList(data: any, player: Player) {
        if (player.userData.level === undefined) {
            this.sendSingle({ command: 'ErrorCreatePlayList', reason: 'You must be logged in to create a playlist' }, player.id)
            return
        }
        if (PlayListManager.isBlocked(player)) {
            this.sendSingle({ command: 'ErrorCreatePlayList', reason: 'You can only create one playlist every day' }, player.id)
            return
        }

        //CHECKS VALIDITY OF REQUEST
        if (await PlayListManager.isAlreadyExist(data.playListName)) {
            this.sendSingle({ command: 'ErrorCreatePlayList', reason: 'PlayList already exists' }, player.id)
            return
        }
        if (!Array.isArray(data.playList)) {
            console.log('is not array')
            this.sendSingle({ command: 'ErrorCreatePlayList', reason: 'Invalid request (might be our mistake)' }, player.id)
            return
        }
        for (let video of data.playList) {
            if (typeof video.startTime !== 'number' || typeof video.url !== 'string' || typeof video.answer !== 'string') {
                this.sendSingle({ command: 'ErrorCreatePlayList', reason: 'Invalid request (might be our mistake)' }, player.id)
                return
            }
        }
        // TODO DO NOT FORGET TO INCREASE THIS VALUE
        if (Object.keys(data.playList).length < 10) {
            this.sendSingle({ command: 'ErrorCreatePlayList', reason: `Not enough video (${data.playList.length} < 10` }, player.id)
            return
        }

        if (!await PlayListManager.checkYoutubeViews(data.playList)) {
            this.sendSingle({ command: 'ErrorCreatePlayList', reason: 'Invalid youtube Url(s)' }, player.id)
            return
        }
        PlayListManager.PostPlayList(data, player)
        this.sendSingle({ command: 'PlayListSuccess', reason: 'We will check the playlist and add it if it pass the quality test' }, player.id)

    }
}
