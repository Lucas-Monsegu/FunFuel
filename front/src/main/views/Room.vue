<template>
    <component
        v-if="inGame"
        :is="gameComponent"
        @ScoreBoard="scoreboard"
        :options="options"
    />
    <ScoreBoard
        v-else-if="inScoreBoard"
        ref="scoreboard"
        :headers="scoreboardHeaders"
        :values="scoreboardValues"
        :gameName="game"
    >
    </ScoreBoard>
    <div
        id="room"
        v-else
    >
        <anim
            name="shuffle"
            autolock
            :opacity="0"
            :speed="4"
        />
        <div id='innerroom'>
            <img
                src="@/main/assets/room/fireplace.svg"
                id="fireplace"
                ondragstart="return false;"
            />

            <img
                src="@/main/assets/room/painting_1.svg"
                id="painting_1"
                ondragstart="return false;"
            />
            <img
                src="@/main/assets/room/painting_2.svg"
                id="painting_2"
                ondragstart="return false;"
            />
            <img
                src="@/main/assets/room/painting_3.svg"
                id="painting_3"
                ondragstart="return false;"
            />
            <img
                src="@/main/assets/room/shelf.svg"
                id="shelf"
                ondragstart="return false;"
            />
            <img
                src="@/main/assets/room/sofa.svg"
                id="sofa"
                ondragstart="return false;"
            />
            <img
                src="@/main/assets/room/window.svg"
                id="window"
                ondragstart="return false;"
            />
            <rules
                id="rules"
                :gameTitle="game"
            />
            <meowAnim />
            <div
                id="teams"
                :class="{ hidden: askPass }"
            >
                <v-row
                    justify="center"
                    id="teamsrow"
                >
                    <v-col
                        class="teamcol"
                        v-for="(team, index) in names"
                        :key="index"
                    >

                        <teamCard
                            :name="team"
                            :team="index"
                        />
                    </v-col>
                </v-row>
            </div>
            <div
                id=game
                :class="{ hidden: askPass }"
            >{{game}}'s settings</div>
            <component
                id="settings"
                ref="settings"
                :is="settingsComponent"
                :class="{ hidden: askPass }"
            />
            <buttons
                id="buttons"
                :class="{ hidden: askPass }"
            />
            <infocard
                id="infocard"
                :askPass="askPass"
            />
            <password
                v-if="askPass !== null"
                id="passCard"
                :class="{ hidden: !askPass }"
                @hidePass="askPass = false"
            />
        </div>
    </div>
</template>

<script>
import rules from '@/main/components/roomlist/Rules'
import meowAnim from '@/main/components/room/MeowAnim'
import teamCard from '@/main/components/room/TeamCard'
import buttons from '@/main/components/room/Buttons'
import infocard from '@/main/components/room/InfoCard'
import password from '@/main/components/room/Password'
import anim from '@/utils/components/anim/AnimOverlay'
import ScoreBoard from '../components/room/ScoreBoard'
import { mapGetters } from 'vuex'

export default {
    name: 'Room',
    components: {
        rules,
        meowAnim,
        teamCard,
        buttons,
        infocard,
        anim,
        password,
        ScoreBoard
    },
    data () {
        return {
            options: {},
            inGame: false,
            askPass: null,
            game: this.$route.params.game,
            inScoreBoard: false,
            unsubscribe: _ => { },
            firstInvalidPassword: true,
            gameComponent: () => import('@/games/' + this.$route.params.game + '/views/Game.vue'),
            settingsComponent: () => import('@/games/' + this.$route.params.game + '/components/Settings.vue'),
            scoreboardHeaders: undefined,
            scoreboardValues: undefined
        }
    },
    mounted () {
        const token = this.$route.params.token
        this.$store.dispatch('joinRoom', { token, game: this.game })
        this.unsubscribe = this.$store.subscribe((mutation, state) => {
            if (mutation.type === 'wsMsg') {
                const msg = JSON.parse(mutation.payload.data)
                switch (msg.command) {
                    case 'InvalidPassword':
                        if (this.firstInvalidPassword) {
                            this.firstInvalidPassword = false
                            this.askPass = true
                        }
                        break
                    case 'CantStart':
                        this.$store.commit('addSnack', {
                            text: `Can't start: ${msg.reason}`,
                            color: 'red'
                        })
                        break
                    case 'Connected':
                        this.$store.dispatch('Join')
                        this.$store.commit('setPublicId', msg.publicId)
                        this.$store.commit('setSessionId', msg.sessionId)
                        this.$store.commit('setRoomName', msg.roomName)
                        break
                    case 'IsGameStarted':
                        this.inGame = msg.started
                        break
                    case 'GetOptions':
                        if (this.$refs.settings) {
                            this.$refs.settings.setOptions(msg)
                        }
                        this.options = msg
                        break
                    case 'TeamInfo':
                        if (msg.randomized) {
                            this.$store.commit('animshuffle', 'play')
                            setTimeout(_ => {
                                this.$store.commit('setNames', msg.names)
                                this.$store.commit('setPlayers', msg.players)
                            }, 800)
                        } else {
                            this.$store.commit('setNames', msg.names)
                            this.$store.commit('setPlayers', msg.players)
                        }
                        break
                    case 'PlayersInfos':
                        this.$store.commit('setPlayersData', msg.infos)
                        this.$store.commit('setMaxPlayers', msg.maxPlayers)
                        this.$store.commit('setNumberPlayers', Object.keys(msg.infos).length)
                        this.$store.commit('setMasterId', msg.master)
                        break
                    case 'WsClosed':
                        switch (msg.reason) {
                            case 'LobbyDoesNotExist':
                                this.$store.commit('addSnack', {
                                    text: 'This room no longer exists.',
                                    color: 'red'
                                })
                                break
                            case 'Replaced':
                                this.$store.commit('addSnack', {
                                    text: 'You have resumed your session elsewhere.',
                                    color: 'info'
                                })
                                break
                            case 'Kicked':
                                this.$store.commit('addSnack', {
                                    text: 'You have been kicked from the room.',
                                    color: 'info'
                                })
                                break
                        }
                        this.$store.getters.ws.onclose = _ => {
                            this.$router.push(`/${this.game}`).catch(_ => { })
                            this.$store.commit('setWs', null)
                        }
                        break
                    case 'Play':
                        this.inGame = true
                        break
                    case 'Error':
                        this.$store.commit('addSnack', {
                            text: msg.reason,
                            color: 'error'
                        })
                        break
                    case 'NotLogged':
                        this.$refs.scoreboard.notLogged()
                        break
                    case 'ReceiveXp':
                        if (msg.xpInfo) {
                            this.$refs.scoreboard.receiveXp(msg.xpInfo)
                        }
                        if (msg.newItem) {
                            this.$refs.scoreboard.setGifts(msg.newItem)
                        }
                        break
                    case 'BackToRoom':
                        this.endGame()
                        break
                }
            }
        })
    },
    destroyed () {
        this.unsubscribe()
        this.$store.dispatch('leaveRoom')
    },
    methods: {
        teamPlayers (idx) {
            const team = this.players[idx]
            if (team.length === 0 || Object.keys(this.playersData).length === 0) {
                return []
            }
            return team.map(id => this.playersData[id])
        },
        endGame () {
            this.inGame = false
            this.inScoreBoard = false
            if (!this.options) {
                this.ws.send(JSON.stringify({ command: 'GetOptions' }))
            }
            this.$nextTick(() => { this.$refs.settings.setOptions(this.options) })
        },
        scoreboard (headers, values) {
            this.scoreboardHeaders = headers
            this.scoreboardValues = values
            this.inScoreBoard = true
            this.inGame = false
        }

    },
    computed: {
        ...mapGetters(['names', 'players', 'playersData', 'maxPlayers', 'numberPlayers', 'isMaster', 'ws'])
    }
}
</script>

<style scoped>
.hidden {
    display: none;
}
#passCard {
    height: calc(100% - 21vw);
    width: 40vw;
    position: absolute;
    left: 30vw;
}
#buttons {
    position: absolute;
    bottom: 17.5vw;
    text-align: center;
    left: 32.5vw;
    width: 35vw;
}
#teams {
    /* background: #ff000030; */
    height: calc(100% - 21vw);
    width: 65vw;
    position: absolute;
    left: 17.5vw;
}
#settings {
    position: absolute;
    left: 40vw;
    height: calc(18vw / 1.7545828867956457);
    width: 20vw;
    bottom: 2.2vw;
}
#game {
    position: absolute;
    left: 40vw;
    text-align: center;
    font-family: "Mont";
    font-size: 1.4vw;
    height: calc(4vw / 1.7545828867956457);
    width: 20vw;
    bottom: 13vw;
    text-transform: capitalize;
}
#fireplace {
    position: absolute;
    left: 32.5vw;
    width: 35vw;
    bottom: 0;
}
#teamsrow {
    height: 100%;
}
.teamcol {
    padding-top: 0;
    padding-bottom: 0;
    max-width: 400px;
}

#painting_1 {
    position: absolute;
    right: 5vw;
    top: 3vh;
    width: 4vw;
}
#painting_2 {
    position: absolute;
    right: 25vw;
    bottom: 15vw;
    width: 4vw;
}
#painting_3 {
    position: absolute;
    left: 17vw;
    bottom: 16vw;
    width: 5vw;
}

#shelf {
    position: absolute;
    right: 13vw;
    bottom: 0;
    width: 10vw;
}
#rules {
    position: absolute;
    width: 6vw;
    height: 3.906vw;
    bottom: 11vw;
    right: 18vw;
}
#sofa {
    position: absolute;
    left: 1vw;
    bottom: 0;
    width: 30vw;
}
#window {
    position: absolute;
    left: 85vw;
    width: 12vw;
    top: 25vh;
}
#innerroom {
    position: absolute;
    width: 100%;
    height: calc(100vh - 48px);
    margin-top: 48px;
}
#room {
    background: rgb(48, 47, 89);
    background: radial-gradient(
        circle,
        rgba(48, 47, 89, 1) 0%,
        rgba(4, 5, 18, 1) 100%
    );
    background-origin: padding-box;
    height: 100vh;
}
</style>
