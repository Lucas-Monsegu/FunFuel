<template>
    <div id='gamecomp'>
        <div id='innergamecomp'>

            <v-row
                no-gutters
                id='mainrow'
            >
                <v-col cols=5>
                    <v-row
                        no-gutters
                        v-for="(playerId, index) in allPlayers"
                        :key="index"
                    >
                        <v-col
                            cols=1
                            class=' py-2 pa-0 pl-2'
                        >
                            <v-card
                                :color="found[playerId] ? found[playerId] : 'dark'"
                                style="height: 100%; width: 100%"
                                outlined
                                tile
                            >
                                <div class="pointText">
                                    {{points[playerId] !== undefined ? points[playerId]: 0}}
                                </div>
                            </v-card>
                        </v-col>
                        <v-col
                            col=4
                            class='pa-0 py-2 pl-2'
                        >
                            <v-card
                                style="height: 100%; width: 100%;"
                                outlined
                                tile
                                color="#242424"
                            >
                                <div class="cardWrapper">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        height="100"
                                        width="599"
                                        class='svgSpacer'
                                    />
                                    <PlayerCard
                                        class='card'
                                        :name="playersData[playerId].userData.username"
                                        :level="playersData[playerId].userData.level"
                                        :avatar="playersData[playerId].userData.avatar"
                                        :pattern="playersData[playerId].userData.pattern"
                                        :team="0"
                                        :cardPublicId="playerId"
                                        @rightClick="$emit('rightClick')"
                                        noedit
                                    />
                                </div>
                            </v-card>
                        </v-col>
                        <v-col
                            cols=5
                            class='pa-0 py-2 pl-2 pr-3'
                        >
                            <v-card
                                style="height: 100%; width: 100%;"
                                outlined
                                tile
                            >
                                <div class='lastTry pl-2'>
                                    {{tries[playerId] !== undefined ? tries[playerId] : ''}}
                                </div>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-col>

                <v-col cols=7>
                    <v-divider
                        dark
                        vertical
                        style='position: absolute; left: 41.5%; height: 100%;'
                    />
                    <v-row
                        id="top"
                        no-gutters
                    >
                        <img
                            src="@/games/blindTest/assets/jacket2.svg"
                            id='jacket'
                            draggable="false"
                            ondragstart="return false;"
                        />
                        <Controls
                            id="controls"
                            :AnswerType="currentAnswerType"
                            :PlayListName="currentPlayListName"
                            :MaxSongs="maxSongs"
                            :CurrentSong="currentSongNumber"
                            ref="controls"
                            @VolumeChange="changeVol"
                        />
                    </v-row>
                    <div id='middle'>
                        <v-divider
                            dark
                            style='position: relative; top: 50%;'
                        />
                    </div>
                    <v-row
                        id="bottom"
                        no-gutters
                    >

                        <AudioPlayer
                            ref="player"
                            :volume="volume"
                        />
                    </v-row>
                </v-col>
            </v-row>
        </div>
    </div>
</template>

<script>
import Controls from '../components/Controls'
import AudioPlayer from '../components/AudioPlayer'
import PlayerCard from '@/main/components/room/PlayerCard'
import { mapGetters } from 'vuex'

export default {
    components: {
        AudioPlayer, Controls, PlayerCard
    },
    data () {
        return {
            found: [],
            tries: {},
            currentAnswerType: '',
            currentPlayListName: '',
            currentSongNumber: 0,
            maxSongs: 0,
            volume: 0.5,
            points: {},
            unsubscribe: () => { },
            headers: [
                {
                    text: 'Name',
                    align: 'start',
                    value: 'name'
                },
                { text: 'Points', value: 'points' }
            ]

        }
    },
    methods: {
        changeVol (vol) {
            this.volume = vol
        },
        createScoreboardValues (points) {
            const res = []
            for (const playerId in points) {
                res.push({ name: this.playersData[playerId].userData.username, points: points[playerId] })
            }
            res.sort((a, b) => { return b.points - a.points })
            return res
        }

    },
    destroyed () {
        this.unsubscribe()
    },
    mounted () {
        this.unsubscribe = this.$store.subscribe((mutation, state) => {
            if (mutation.type === 'wsMsg') {
                const msg = JSON.parse(mutation.payload.data)
                switch (msg.command) {
                    case 'NewSong':
                        this.found = {}
                        this.tries = {}
                        this.$refs.controls.setSeconds(30)
                        this.$refs.player.play(msg.playListName, msg.song)
                        this.currentAnswerType = msg.answerType
                        this.currentPlayListName = msg.playListName
                        this.currentSongNumber = msg.currentSong
                        break
                    case 'GoodAnswer':
                        this.points = msg.points
                        this.$set(this.found, msg.player, '#43A047')
                        break
                    case 'Result':
                        this.$refs.controls.setSeconds(5)
                        this.$refs.player.sayAnswer(msg.goodAnswer)
                        break
                    case 'Try':
                        this.$set(this.tries, msg.player, msg.text)
                        break
                    case 'Almost':
                        this.$refs.controls.almost(msg.leven, msg.text)
                        break
                    case 'Spam':
                        this.$refs.controls.spam(msg.text)
                        break
                    case 'GameEnd':
                        this.points = msg.points
                        setTimeout(() => {
                            this.$emit('ScoreBoard', this.headers, this.createScoreboardValues(msg.points))
                        }, 0)
                        break
                    case 'GetStateOfTheGame':
                        this.points = msg.points
                        this.$refs.controls.setSeconds(msg.remainingSec)
                        this.currentAnswerType = msg.answerType
                        this.currentPlayListName = msg.playListName
                        this.currentSongNumber = msg.currentSong
                        this.maxSongs = msg.maxSongs
                }
            }
        })
        this.$store.dispatch('GetStateOfTheGame')
    },
    computed: {
        ...mapGetters(['players', 'playersData', 'publicId', 'ws']),
        allPlayers () {
            return this.players.flat()
        }
    }

}
</script>

<style scoped>
#mainrow {
    position: relative;
    height: 100%;
}
#playList {
    position: relative;
    text-align: center;
}
#innergamecomp {
    position: absolute;
    /* background-color: brown; */
    width: 100%;
    height: calc(100vh - 48px);
    margin-top: 48px;
}
#controls {
    position: relative;
    width: 100%;
}
#top {
    position: relative;
    height: 40%;
}
#middle {
    position: relative;
    height: 10%;
    pointer-events: none;
}
#bottom {
    position: relative;
    height: 50%;
}
.audioPlayer {
    position: relative;
    top: 0%;
    width: 100%;
    height: 50%;
}
.pointText {
    width: 100%;
    position: relative;
    top: 25%;
    text-align: center;
}
.lastTry {
    position: relative;
    top: 25%;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}
.cardWrapper {
    position: relative;
    width: 100%;
    max-width: 250px;
    left: 50%;
    transform: translateX(-50%);
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
#gamecomp {
    /* background-image: url("~@/games/mentalist/assets/pattern.svg"); */
    /* background-repeat: repeat; */
    /* background-size: 14vmin; */
    height: 100vh;
    background-color: #242424;
}
#jacket {
    position: absolute;
    top: 0%;
    left: 50%;
    width: 90vmin;
    transform: translateX(-50%);
}
</style>
