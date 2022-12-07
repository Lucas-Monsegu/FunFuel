<template>
    <div id="gamecomp">
        <div id='innergamecomp'>
            <img
                src="@/games/mentalist/assets/talky_wakly.svg"
                id='talky'
                draggable="false"
                ondragstart="return false;"
            />
            <img
                src="@/games/mentalist/assets/floppy_disk.svg"
                id='floppy'
                draggable="false"
                ondragstart="return false;"
            />
            <img
                src="@/games/mentalist/assets/glasses.svg"
                id='glasses'
                draggable="false"
                ondragstart="return false;"
            />
            <img
                src="@/games/mentalist/assets/camera.svg"
                id='camera'
                draggable="false"
                ondragstart="return false;"
            />
            <div id="square">
                <img
                    src="@/games/mentalist/assets/center_bg.svg"
                    id='centerbg'
                    draggable="false"
                    ondragstart="return false;"
                />
                <v-fade-transition>
                    <div
                        id="mic"
                        :style="micStyle(yourTurn)"
                    >
                        <img
                            src="@/games/mentalist/assets/microphone.svg"
                            id='microphone'
                            draggable="false"
                            ondragstart="return false;"
                        />
                        <svg
                            id="redlight"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 417 417"
                        >
                            <circle
                                cx="317.86"
                                cy="205.82"
                                r="5.42"
                                class="blink"
                                :style="`fill:#f9637c`"
                            />
                        </svg>
                    </div>
                </v-fade-transition>
                <v-col
                    cols="12"
                    sm="6"
                    md="5"
                    v-if="yourTurn"
                    id="inputfield"
                >
                    <v-text-field
                        v-model="myWord"
                        @keypress.enter="sendWord"
                        label="Your turn"
                        outlined
                        maxlength="30"
                        autofocus
                        color="white"
                        autocomplete="off"
                        append-icon="mdi-keyboard-return"
                        hide-details
                    ></v-text-field>
                </v-col>

                <div
                    class="cardWrapper"
                    v-for="(player, index) in orderedPlayers"
                    :key="index"
                    :style="getStylePlayer(allPlayers.length, index)"
                >

                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="100"
                        width="599"
                        class='svgSpacer'
                    />

                    <playerCard
                        class="card"
                        :name="playersData[player].userData.username"
                        :level="playersData[player].userData.level"
                        :team="5"
                        :avatar="playersData[player].userData.avatar"
                        :pattern="playersData[player].userData.pattern"
                        :cardPublicId="player"
                        :bubbletop="allPlayers.length % 2 === 0 && index === allPlayers.length - 1"
                        :text="texts[player]"
                        :infos="playersInfos[player]"
                        @rightClick="rightClick($event, player)"
                        @vote="vote"
                        :voting="voting"
                        :eliminated="!isAlive(player)"
                        :alive="isAlive(publicId)"
                        :mentalistsay="blue.has(player)"
                    />

                </div>

                <v-fade-transition>
                    <Timer
                        v-show="showTimer"
                        id="timer"
                        ref="timer"
                    />
                </v-fade-transition>
                <v-fade-transition>
                    <Word
                        v-show="showWord && status != 2"
                        id="word"
                        :word="word"
                        :mentalist="status === 1"
                    />
                </v-fade-transition>
                <PhaseInfo
                    id="phaseinfo"
                    ref="phaseInfo"
                />
            </div>
            <RoleReveal
                id="rolereveal"
                ref="rolereveal"
            />
        </div>
    </div>
</template>

<script>
import Vector from '@/utils/js/Vector.js'
import PlayerCard from '@/games/mentalist/components/PlayerCard'
import anim from 'animejs'
import RoleReveal from '@/games/mentalist/components/RoleReveal'
import Timer from '@/games/mentalist/components/Timer'
import Word from '@/games/mentalist/components/Word'
import PhaseInfo from '@/games/mentalist/components/PhaseInfo'
import { mapGetters } from 'vuex'

export default {
    components: {
        PlayerCard,
        RoleReveal,
        Timer,
        Word,
        PhaseInfo
    },
    props: {
        options: {
            type: Object
        }
    },
    data () {
        return {
            heightSquare: 0,
            currentAngle: 0,
            currentPlayer: null,
            myWord: '',
            word: '',
            texts: {},
            playersInfos: {},
            turn: 0,
            blue: new Set(),
            voting: false,
            unsubscribe: () => { },
            showTimer: true,
            showWord: true,
            sent: false,
            status: 0, // 0: unknown, 1: mentalist, 2: observer
            headers: [
                {
                    text: 'Name',
                    align: 'start',
                    value: 'name'
                },
                { text: 'Role', value: 'role' },
                { text: 'Victory', value: 'victory' }
            ]
        }
    },
    mounted () {
        this.microphoneEl = document.getElementById('mic')
        const square = document.getElementById('square')
        this.heightSquare = square.offsetWidth
        window.onresize = _ => {
            this.heightSquare = square.offsetWidth
        }
        this.unsubscribe = this.$store.subscribe((mutation, state) => {
            if (mutation.type === 'wsMsg') {
                const msg = JSON.parse(mutation.payload.data)
                switch (msg.command) {
                    case 'Talk':
                        this.sent = false
                        this.showTimer = true
                        this.$refs.timer.setSeconds(this.options.msPerTurn / 1000)
                        this.currentPlayer = msg.player
                        this.turnTo(msg.player)
                        break
                    case 'Word':
                        this.sent = true
                        this.showTimer = false
                        if (msg.history) {
                            this.playersInfos[msg.player].history = msg.history
                        }

                        this.$set(this.texts, msg.player, msg.word)
                        break
                    case 'GetStateOfTheGame':
                        this.playersInfos = msg.playersInfos
                        this.turn = msg.turn
                        this.currentPlayer = msg.talking
                        this.voting = msg.voting
                        switch (msg.word) {
                            case undefined:
                                this.status = 2
                                break
                            case '':
                                this.status = 1
                                break
                            default:
                                this.status = 0
                                this.word = msg.word
                                break
                        }

                        this.$refs.timer.setSeconds(Math.ceil(msg.timeleft / 1000))
                        break
                    case 'MentalistAnim':
                        this.showTimer = false
                        this.showWord = false
                        this.$refs.rolereveal.animate(this.playersData[msg.player].userData.username, 1)
                        setTimeout(() => {
                            this.$refs.phaseInfo.animate('Wait for the mentalist\'s last guess')
                            setTimeout(() => {
                                this.$refs.timer.setSeconds(this.options.msPerTurn / 1000 - 2)
                                this.showTimer = true
                                this.showWord = true
                            }, 2000)
                        }, 3000)
                        break

                    case 'EliminatePlayer':
                        this.showTimer = false
                        this.showWord = false
                        this.playersInfos[msg.player].alive = false
                        if (msg.noanim) {
                            break
                        }
                        this.$refs.rolereveal.animate(this.playersData[msg.player].userData.username, msg.role)
                        break
                    case 'Phase':
                        this.voting = (msg.phase === 'vote')
                        this.showTimer = true
                        this.showWord = true
                        if (this.voting) {
                            this.currentPlayer = null
                            this.$refs.timer.setSeconds(this.options.msPerVote / 1000)
                            this.$refs.phaseInfo.animate('Time to vote !')
                            setTimeout(() => {
                                this.texts = {}
                            }, 2000)
                        } else {
                            this.$refs.phaseInfo.animate('Time to talk !')
                            this.texts = {}
                        }
                        break
                    case 'Vote':
                        this.$set(this.texts, msg.player, this.playersData[msg.playerVoted].userData.username)
                        break
                    case 'MentalistGuess':
                        this.blue.add(msg.player)
                        this.texts[msg.player] = msg.word
                        break
                    case 'RoleWin':
                        this.showTimer = false
                        this.showWord = false
                        this.$refs.rolereveal.animate('', msg.role, true)
                        break
                    case 'GameEnd':
                        this.$emit('ScoreBoard', this.headers, this.createScoreboardValues(msg.allRoles, msg.winners))
                        break
                }
            }
        })
        this.$store.dispatch('GetStateOfTheGame')
    },
    destroyed () {
        window.onresize = null
        this.unsubscribe()
    },
    computed: {
        ...mapGetters(['players', 'playersData', 'publicId', 'ws']),
        allPlayers () {
            return this.players.flat()
        },
        orderedPlayers () {
            const players = this.players.flat()
            if (players.length === 0) {
                return []
            }
            const res = [players[0]]
            const len = players.length / 2
            for (let i = 1; i <= len; ++i) {
                if (i === len) {
                    res.push(players[i])
                } else {
                    res.push(players[players.length - i], players[i])
                }
            }
            return res
        },
        yourTurn () {
            return !this.sent && this.currentPlayer === this.publicId
        },
        isMentalist (playerId) {
            return playerId
        }
    },
    methods: {
        createScoreboardValues (allRoles, winners) {
            const res = []
            const RolesToStr = {
                0: 'Citizen',
                1: 'Mentalist',
                2: 'Double Agent'
            }
            for (const playerId in allRoles) {
                res.push({ name: this.playersData[playerId].userData.username, role: RolesToStr[allRoles[playerId]], victory: winners.some(el => { return el === playerId }) ? 'Win' : 'Lose' })
            }
            res.sort((a, b) => { return a.victory === 'Win' ? -1 : 1 })
            return res
        },
        isAlive (player) {
            const playerInfo = this.playersInfos[player]
            if (!playerInfo) { return true }
            return playerInfo.alive
        },
        micStyle (yourTurn) {
            return {
                opacity: yourTurn ? 0.1 : 1,
                visibility: this.voting ? 'hidden' : 'visible'
            }
        },
        getCoordinateInCircle (nPlayers, index) {
            const angle = 4 / nPlayers
            const height = this.heightSquare
            const r = height / 2 - 40 // fix offset
            index += 1
            const res = Vector.fromPolar(r, Math.asin(Math.floor(index / 2) * angle - 1))
            res.x *= index % 2 ? 1 : -1
            return res
        },
        getAngleInCircle (nPlayers, index) {
            const dangle = 4 / nPlayers
            index += 1
            let angle = Math.asin(Math.floor(index / 2) * dangle - 1)
            if (index % 2 === 0) {
                angle = Math.PI - angle
            }
            return angle
        },
        getStylePlayer (nplayers, index) {
            const pos = this.getCoordinateInCircle(nplayers, index)
            return {
                top: `${pos.y + this.heightSquare / 2}px`,
                left: `${pos.x + this.heightSquare / 2}px`,
                transform: 'translate(-50%, -50%)'
            }
        },
        updateTurn (anim) {
            this.microphoneEl.style.transform = `translate(-50%, -50%) rotate(${this.currentAngle}rad)`
        },
        turnAnim (newAngle) {
            anim({
                targets: this,
                currentAngle: [this.currentAngle, newAngle],
                update: this.updateTurn,
                duration: 700
            })
        },
        turnTo (player) {
            if (player) {
                const rotateNumber = this.orderedPlayers.indexOf(player)
                this.turnAnim(this.getAngleInCircle(this.allPlayers.length, rotateNumber))
            }
        },
        sendWord () {
            const myword = this.myWord.replace(/\s+/g, ' ').trim()
            this.ws.send(JSON.stringify({ command: 'SendWord', player: this.publicId, word: myword }))
            this.myWord = ''
        },
        rightClick () {
        },
        vote (voted) {
            this.ws.send(JSON.stringify({ command: 'Vote', voted }))
        }
    }
}
</script>

<style scoped>
#word {
    position: absolute;
    bottom: 15%;
    left: 50%;
    transform: translateX(-50%);
}
#timer {
    position: absolute;
    top: 14.5%;
    left: 50%;
    transform: translateX(-50%);
}
.cardWrapper {
    position: absolute;
    width: 35vmin;
}
.svgSpacer {
    width: 100%;
    height: auto;
    display: block;
}
.card {
    /* background: #00ff0030; */
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
}
#centerbg {
    position: absolute;
    height: 100%;
}
.blink {
    animation-name: blink;
    -webkit-animation-duration: 0.8s;
    animation-duration: 0.8s;
    -webkit-animation-iteration-count: infinite;
    animation-iteration-count: infinite;
    -webkit-animation-direction: alternate;
    animation-direction: alternate;
    -webkit-animation-timing-function: ease-in-out;
    animation-timing-function: ease-in-out;
}
@keyframes blink {
    0% {
        fill: #ff7d7d;
    }
    50% {
        fill: #ff7d7d;
    }
    50.1% {
        fill: red;
    }
    100% {
        fill: red;
    }
}
#microphone,
#redlight {
    position: absolute;
    width: 40vmin;
    transform: translate(-50%, -50%);
}
#mic {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-90deg);
}
#rolereveal {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 30%;
    transform: translate(-50%, -50%);
}
#phaseinfo {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    transform: translate(-50%, -50%);
}
#inputfield {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
#camera {
    position: absolute;
    left: 50px;
    bottom: 100px;
    width: 30vmin;
}
#glasses {
    position: absolute;
    right: 50px;
    top: 100px;
    width: 15vmin;
}
#floppy {
    position: absolute;
    left: 50px;
    top: 100px;
    width: 20vmin;
}
#talky {
    position: absolute;
    right: 50px;
    bottom: 100px;
    width: 12vmin;
}
#square {
    width: calc(100vmin - 48px);
    height: calc(100vmin - 48px);
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
}
#innergamecomp {
    position: absolute;
    width: 100%;
    height: calc(100vh - 48px);
    margin-top: 48px;
}
#gamecomp {
    background-image: url("~@/games/mentalist/assets/pattern.svg");
    background-repeat: repeat;
    background-size: 14vmin;
    height: 100vh;
    background-color: #242424;
}
</style>
