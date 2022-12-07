<template>
    <div>
        <div id='bg' />
        <img
            src="@/games/spellingWariors/assets/bplus.svg"
            id='bplus'
            draggable="false"
            ondragstart="return false;"
        />
        <img
            src="@/games/spellingWariors/assets/fountainpen.svg"
            id='fountainpen'
            draggable="false"
            ondragstart="return false;"
        />
        <img
            src="@/games/spellingWariors/assets/pen.svg"
            id='pen'
            draggable="false"
            ondragstart="return false;"
        />
        <img
            src="@/games/spellingWariors/assets/pencil.svg"
            id='pencil'
            draggable="false"
            ondragstart="return false;"
        />
        <img
            src="@/games/spellingWariors/assets/rubber.svg"
            id='rubber'
            draggable="false"
            ondragstart="return false;"
        />
        <img
            src="@/games/spellingWariors/assets/rule.svg"
            id='rule'
            draggable="false"
            ondragstart="return false;"
        />
        <component
            v-if="!phase1"
            :words="words"
            :infos="infos"
            ref="phase2comp"
            :is="Phase"
        />
        <div v-else>
            <AnimOverlay
                name='spellingfinish'
                :opacity="50"
                :width="800"
            />
            <div id="volume">
                <v-slider
                    v-model="volume"
                    :thumb-size="24"
                    label="Volume:"
                    thumb-label="always"
                    color="orange"
                    @change="ChangeVol()"
                />
            </div>

            <CustomInput
                id="mid"
                :lang="options.lang"
                ref="customInp"
                @Finish="finish"
            />
            <div
                class="my-2"
                id="buttonext"
                v-if="finished"
            >
                <v-btn
                    :disabled="!isMaster"
                    color="orange"
                    rounded
                    dark
                    @click="nextPhase()"
                >Next</v-btn>
            </div>
        </div>
        <ScoreBoard
            :open="endgame"
            :winners="winners"
        />
    </div>
</template>

<script>
import CustomInput from '@/games/spellingWariors/components/CustomInput'
import AnimOverlay from '@/utils/components/anim/AnimOverlay'
import ScoreBoard from '@/games/spellingWariors/components/ScoreBoard'
import { mapGetters } from 'vuex'
export default {
    components: {
        AnimOverlay, CustomInput, ScoreBoard
    },
    props: {
        options: {
            type: Object
        }
    },
    data () {
        return {
            volume: 80,
            finished: false,
            phase1: true,
            words: [],
            Infos: undefined,
            currentWord: 0,
            endgame: false,
            winners: [],
            unsubscribe: () => { },
            Phase: () => import('@/games/' + this.$route.params.game + '/views/Phase2.vue')
        }
    },
    mounted () {
        if (!this.phase2) {
            this.ChangeVol()
        }
        this.$refs.customInp.setSpeed(this.options.speed)
        this.unsubscribe = this.$store.subscribe((mutation, state) => {
            if (mutation.type === 'wsMsg') {
                const msg = JSON.parse(mutation.payload.data)
                switch (msg.command) {
                    case 'GetStateOfTheGame':
                        this.phase1 = msg.phase1
                        this.words = msg.words
                        this.currentWord = msg.currentWord
                        this.infos = msg.infos
                        if (this.phase1 === true) {
                            this.$refs.customInp.setWords(this.words)
                        }
                        break
                    case 'Next':
                        this.$refs.phase2comp.nextWord()
                        break
                    case 'EndGame':
                        this.winners = msg.winners
                        this.endgame = true
                        setTimeout(() => {
                            this.$emit('GameEnd')
                        }, 10000)
                }
            }
        })
        this.$store.dispatch('GetStateOfTheGame')
    },
    destroyed () {
        this.unsubscribe()
    },
    methods: {

        ChangeVol () {
            this.$refs.customInp.changeVolume(this.volume)
        },
        finish (words) {
            this.ws.send(JSON.stringify({ command: 'SendWords', words: words }))
            setTimeout(() => {
                this.finished = true
            }, 500)
            this.$store.commit('animspellingfinish', 'play')
        },
        nextPhase () {
            if (this.isMaster) {
                this.ws.send(JSON.stringify({ command: 'Phase2' }))
            }
        }
    },
    computed: {
        ...mapGetters(['publicId', 'masterId', 'ws']),

        isMaster () {
            return this.publicId === this.masterId
        }
    }

}
</script>

<style scoped>
#bg {
    position: absolute;
    width: 100%;
    height: 100%;
    background: #484e59;
}
#buttonext {
    position: absolute;
    left: 50%;
    top: 70%;
    transform: translate(-50%, -50%);
}
#radio {
    position: absolute;
    width: 55vw;
    top: 5%;
    left: 40%;
}
#volume {
    position: absolute;
    top: 15%;
    width: 200px;
    height: 100px;
    left: calc(50% - 100px);
}
#mid {
    position: absolute;
    width: 100%;
    height: 100px;
    top: 30%;
}
#bplus {
    position: absolute;
    right: 20px;
    top: 50px;
    width: 15vmin;
}
#fountainpen {
    position: absolute;
    left: 70px;
    top: 70px;
    width: 10vmin;
}
#pen {
    position: absolute;
    right: 20px;
    bottom: 20px;
    width: 7vmin;
}
#pencil {
    position: absolute;
    right: 250px;
    top: 70px;
    width: 15vmin;
}
#rubber {
    position: absolute;
    left: 300px;
    top: 60px;
    width: 14vmin;
}
#rule {
    position: absolute;
    left: 40px;
    bottom: 10px;
    width: 30vmin;
}
</style>
