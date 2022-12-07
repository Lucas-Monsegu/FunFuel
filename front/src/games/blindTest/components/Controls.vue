<template>
    <div>
        <div
            id='playList'
            class="display-1 text-capitalize"
        >
            {{this.PlayListName}}
        </div>
        <v-progress-circular
            id='timer'
            :rotate="-90"
            :size="70"
            :width="10"
            :value="seconds/30 * 100"
            :color="seconds <= 5 && seconds !== 0 ? 'red' : 'teal'"
        >
            {{ seconds }}
        </v-progress-circular>

        <div id='input'>
            <v-text-field
                :label="capitalizeFirstLetter"
                v-model="answer"
                single-line
                autofocus
                @keypress.enter="enter"
                :disabled="isObs"
                :hint="answerHint"
                persistent-hint
                ref="answerButton"
                color='white'
            ></v-text-field>
        </div>

        <div id='slider'>
            <v-slider
                v-model="volume"
                :thumb-size="24"
                :min="0"
                vertical
                color="teal"
                :max="1"
                :step="0.05"
                append-icon="mdi-volume-high"
                thumb-label="always"
                @change="changeVol"
            ></v-slider>
        </div>
        <div id='songsLeft'>
            <v-chip
                class="ma-2"
                color="teal"
                label
                outlined
                large
            >
                {{CurrentSong}} / {{MaxSongs}} songs
            </v-chip>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    props: {
        AnswerType: String,
        PlayListName: String,
        CurrentSong: Number,
        MaxSongs: Number
    },
    data () {
        return {
            seconds: 30,
            volume: 0.5,
            interval: null,
            answer: '',
            answerHint: '',
            answerColor: 'white'
        }
    },
    mounted () {
        this.setSeconds(30)
    },
    computed: {
        ...mapGetters(['ws', 'isObs']),
        capitalizeFirstLetter () {
            return this.AnswerType.charAt(0).toUpperCase() + this.AnswerType.slice(1)
        }
    },
    methods: {
        sendAnswer (e) {
            this.ws.send(JSON.stringify({ command: 'Answer', answer: this.answer }))
            this.answer = ''
            this.answerHint = ''
        },
        almost (len, lastword) {
            this.answerHint = `Almost: ${lastword}`
        },
        spam (spamMsg) {
            this.answerHint = spamMsg
        },
        setSeconds (seconds) {
            clearInterval(this.interval)
            this.seconds = seconds
            this.interval = setInterval(_ => {
                if (this.seconds > 0) { this.seconds-- } else { clearInterval(this.interval) }
            }, 1000)
        },
        changeVol () {
            this.$emit('VolumeChange', this.volume)
        },
        enter () {
            this.sendAnswer()
        },
        focus (e) {
            e.target.select()
        }
    }

}
</script>

<style scoped>
#slider {
    position: relative;
    width: 10%;
    top: 0%;
    left: 3%;
}
#playList {
    position: relative;
    top: 10%;
    text-align: center;
}
#input {
    position: relative;
    width: 30vmin;
    left: 50%;
    top: 20%;
    transform: translateX(-50%);
}
#timer {
    position: relative;
    left: 5%;
    top: 0%;
}
#songsLeft {
    position: absolute;
    right: 3%;
    top: 5%;
}
</style>
