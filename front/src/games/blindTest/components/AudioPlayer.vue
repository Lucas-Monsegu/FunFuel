<template>
    <div id='parent'>
        <canvas
            id="canva"
            width="100px"
            height="100px"
        ></canvas>
        <div
            id='answer'
            v-if="answerDisplay"
            class='text-capitalize display-1'
        >
            {{realAnswer}}
        </div>

        <div
            id='soundActivator'
            v-if="!canPlay"
            @click="activateSound"
        >
            <div id='titleSoundActivator'>
                Click here to activate audio
            </div>
        </div>
        <animdiv
            name="clickable"
            loop
        />
    </div>
</template>

<script>
import animdiv from '../../../utils/components/anim/AnimDiv'
export default {
    components: {
        animdiv
    },
    props: {
        volume: {
            type: Number
        }

    },
    data () {
        return {
            audio: new Audio(),
            context: new AudioContext(),
            src: undefined,
            analyser: undefined,
            fadedIn: false,
            fadedOut: false,
            can: null,
            parent: null,
            canvasWidth: null,
            canvasHeight: null,
            barWidth: null,
            bufferLength: null,
            answerDisplay: false,
            completeAnswer: '',
            realAnswer: '',
            startDate: undefined,
            lastPlay: false,
            canPlay: true
        }
    },
    watch: {
        volume: function (newVal, oldVal) {
            if (this.audio) {
                this.audio.volume = newVal
            }
        }
    },
    mounted () {
        this.src = this.context.createMediaElementSource(this.audio)
        this.analyser = this.context.createAnalyser()
        this.parent = document.getElementById('parent')
        this.can = document.getElementById('canva')
        this.audio.onplay = () => {
            const duration = parseFloat(this.audio.duration)
            if (duration > 15) {
                this.lastPlay = true
            }
            if (!this.fadedIn) {
                this.fadedIn = true
                this.fadeIn()
            }
        }
        this.audio.onended = () => {
            const globaltimeLeft = (Date.now() - this.startDate) / 1000
            if (globaltimeLeft < 25) {
                this.audio.play()
            }
        }
        this.audio.ontimeupdate = () => {
            if (!this.lastPlay) {
                return
            }
            const duration = parseFloat(this.audio.duration)
            const currentTime = parseFloat(this.audio.currentTime)
            const timeLeft = duration - currentTime
            const globaltimeLeft = this.startDate - Date.now()
            if (!this.fadedOut && (timeLeft <= 1 || globaltimeLeft >= 29)) {
                this.fadedOut = true
                this.fadeOut()
            }
        }
        window.addEventListener('resize', () => {
            let doCheck = true
            if (doCheck) {
                doCheck = false
                this.canvasWidth = this.parent.clientWidth
                this.canvasHeight = this.parent.clientHeight
                this.can.width = this.canvasWidth
                this.can.height = this.canvasHeight - 20
                this.barWidth = (this.canvasWidth / this.bufferLength) * 2.5
                setTimeout(function () {
                    doCheck = true
                }, 500)
            }
        })
    },
    destroyed () {
        if (this.audio === null || this.audio === undefined) {
            return
        }
        this.audio.pause()
        this.audio.removeAttribute('src')
        this.audio.load()
        this.$store.commit('animclickable', 'finished')
    },
    methods: {
        async activateSound () {
            await this.context.resume()
            this.audio.play()
            this.canPlay = true
            this.$store.commit('animclickable', 'finished')
        },
        easeInQuart (x) {
            if (x > 1) {
                return 1
            }
            if (x < 0) {
                return 0
            }
            return x * x * x
        },
        animeRec (n) {
            if (n >= this.completeAnswer.length) {
                return
            }
            this.realAnswer += this.completeAnswer[n]
            setTimeout(() => { this.animeRec(n + 1) }, 1000 / this.completeAnswer.length)
        },
        sayAnswer (completAnswer) {
            this.completeAnswer = completAnswer
            this.answerDisplay = true
            this.animeRec(0)
            setTimeout(() => {
                this.answerDisplay = false
                this.realAnswer = ''
            }, 4500)
        },
        fadeIn () {
            this.audio.muted = false
            const t = setInterval(() => {
                const currentTime = parseFloat(this.audio.currentTime)
                this.audio.volume = this.easeInQuart(currentTime) * this.volume
            }, 50)
            setTimeout(() => {
                clearInterval(t)
                this.audio.volume = this.volume
            }, 1000)
        },
        fadeOut () {
            const t = setInterval(() => {
                const duration = parseFloat(this.audio.duration)
                const currentTime = parseFloat(this.audio.currentTime)
                const timeLeft = (duration - currentTime)
                this.audio.volume = this.easeInQuart(timeLeft) * this.volume
            }, 50)
            setTimeout(() => {
                clearInterval(t)
                this.audio.volume = this.volume
            }, 1000)
        },

        play (playList, n) {
            this.audio.volume = 0
            this.audio.muted = true
            if (this.context.state !== 'running') {
                this.canPlay = false
                this.$store.commit('animclickable', 'play')
            }
            this.startDate = Date.now()
            this.audio.pause()
            this.audio.removeAttribute('src')
            this.fadedIn = false
            this.fadedOut = false
            const audio = this.audio

            audio.crossOrigin = 'anonymous'
            audio.src = `https://funfuelbucket.s3.amazonaws.com/blindtest/${playList}/${n}.mp3`
            audio.load()
            audio.play()
            const context = this.context
            const src = this.src
            const analyser = this.analyser

            const can = this.can
            const parent = this.parent
            this.canvasWidth = parent.clientWidth
            this.canvasHeight = parent.clientHeight
            can.width = this.canvasWidth
            can.height = this.canvasHeight - 20

            const ctx = can.getContext('2d')

            src.connect(analyser)
            analyser.connect(context.destination)

            analyser.fftSize = 256

            const bufferLength = analyser.frequencyBinCount
            this.bufferLength = bufferLength

            const dataArray = new Uint8Array(bufferLength)

            const WIDTH = can.width

            const barWidth = (WIDTH / bufferLength) * 2.5
            this.barWidth = barWidth
            let barHeight
            let x = 0
            const ref = this
            function renderFrame () {
                requestAnimationFrame(renderFrame)

                x = 0

                analyser.getByteFrequencyData(dataArray)

                ctx.fillStyle = '#242424'
                ctx.fillRect(0, 0, ref.canvasWidth, ref.canvasHeight)

                for (let i = 0; i < bufferLength; i++) {
                    barHeight = dataArray[i]

                    const r = barHeight + (25 * (i / bufferLength))
                    const g = 250 * (i / bufferLength)
                    const b = 50

                    ctx.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')'
                    ctx.fillRect(x, ref.canvasHeight - barHeight, ref.barWidth, barHeight)

                    x += ref.barWidth + 1
                }
            }

            renderFrame()
        }
    }
}
</script>

<style scoped>
#animclickable {
    position: absolute;
    width: 80%;
    height: 80%;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
}
#answer {
    position: absolute;
    top: 0%;
    text-align: center;
    width: 100%;
}
#parent {
    position: relative;
    width: 100%;
    height: 100%;
    bottom: 0;
}
#canva {
    position: absolute;
    bottom: 0;
    right: 0;
}
#soundActivator {
    width: 100%;
    height: 100%;
    cursor: pointer;
    background-color: #0096885f;
    opacity: 0.9;
}
#titleSoundActivator {
    position: absolute;
    width: 100%;
    bottom: 10%;
    font-family: "Mont";
    text-align: center;
    font-size: 50px;
}
</style>
