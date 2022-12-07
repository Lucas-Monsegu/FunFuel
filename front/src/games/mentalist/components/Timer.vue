<template>
    <div id="timer">
        <img
            src="@/games/mentalist/assets/timer.svg"
            id='timerimg'
            draggable="false"
            ondragstart="return false;"
        />
        <div
            id="timertext"
            :style="getStyleTimerText()"
        >
            {{secondsLeft}}
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            secondsLeft: 0,
            interval: null
        }
    },
    methods: {
        setSeconds (seconds) {
            clearInterval(this.interval)
            this.secondsLeft = seconds
            this.interval = setInterval(_ => {
                if (this.secondsLeft > 0) { this.secondsLeft-- } else { clearInterval(this.interval) }
            }, 1000)
        },
        getStyleTimerText () {
            return {
                color: this.secondsLeft < 10 ? '#d43a35' : '#000000',
                fontsize: '35px'
            }
        }
    },
    destroyed () {
        clearInterval(this.interval)
    }
}
</script>

<style scoped>
#timer {
    width: 8%;
    height: 10.1%;
    position: relative;
}
#timerimg,
#timertext {
    position: absolute;
}
#timertext {
    font-size: 2em;
    left: 50%;
    top: 60%;
    transform: translate(-50%, -50%);
}
</style>
