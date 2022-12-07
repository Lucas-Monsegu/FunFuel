<template>
    <div id="clock">
        <img
            src="@/main/assets/roomlist/clock/cadran.svg"
            id="cadran"
            ondragstart="return false;"
        />
        <img
            src="@/main/assets/roomlist/clock/hour_hand.svg"
            id="hourHand"
            ondragstart="return false;"
        />
        <img
            src="@/main/assets/roomlist/clock/minute_hand.svg"
            id="minuteHand"
            ondragstart="return false;"
        />
    </div>
</template>

<script>
export default {
    data () {
        return {
            interval: null,
            hourHand: null,
            minuteHand: null
        }
    },
    mounted () {
        this.hourHand = document.getElementById('hourHand')
        this.minuteHand = document.getElementById('minuteHand')
        this.updateTime()
        setTimeout(_ => {
            this.updateTime()
            this.interval = setInterval(this.updateTime, 60000)
        }, 1000 * (61 - new Date().getSeconds()))
    },
    destroyed () {
        clearInterval(this.interval)
    },
    methods: {
        updateTime () {
            const now = new Date()
            const hours = 30 * (now.getHours() % 12)
            const minutes = 6 * now.getMinutes()
            this.hourHand.style.transform = `rotate(${hours}deg)`
            this.minuteHand.style.transform = `rotate(${minutes}deg)`
        }
    }
}
</script>

<style scoped>
#clock * {
    position: absolute;
    width: 8vw;
}
</style>
