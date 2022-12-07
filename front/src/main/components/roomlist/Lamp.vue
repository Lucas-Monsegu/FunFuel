<template>
    <div id="lamp">
        <img
            src="@/main/assets/roomlist/lamp/foot.svg"
            id="foot"
            ondragstart="return false;"
        />
        <img
            src="@/main/assets/roomlist/lamp/light.svg"
            id="light"
            ondragstart="return false;"
        />
        <img
            src="@/main/assets/roomlist/lamp/switch.svg"
            id="switch"
            ondragstart="return false;"
            @mousedown="down"
        />
        <img
            src="@/main/assets/roomlist/lamp/abajour.svg"
            id="abajour"
            ondragstart="return false;"
        />
    </div>
</template>

<script>
import anime from 'animejs'
export default {
    data () {
        return {
            isdragged: false,
            downPoint: null,
            switchElement: null,
            lightOn: false
        }
    },
    mounted () {
        this.switchElement = document.getElementById('switch')
        this.lightElement = document.getElementById('light')
        document.onmousemove = this.move
        document.onmouseup = this.up
    },
    methods: {
        down (e) {
            if (e.preventDefault) e.preventDefault()
            this.isdragged = true
            this.downPoint = { x: e.x, y: e.y }
        },
        move (e) {
            if (this.isdragged) {
                const onOffset = this.lightOn ? 20 : 0
                const dy = Math.max(0, Math.min(e.y - this.downPoint.y + onOffset, 30))
                this.switchElement.style.transform = `translateY(${dy}px)`
            }
        },
        up (e) {
            if (this.isdragged) {
                this.isdragged = false
                const dy = Math.max(0, Math.min(e.y - this.downPoint.y, 30))
                if ((!this.lightOn && dy === 30) || (this.lightOn && dy >= 10)) {
                    this.toggleLight()
                } else if (!this.lightOn) {
                    this.resetOff()
                } else {
                    this.resetOn()
                }
            }
        },
        resetOff () {
            anime({
                targets: this.switchElement,
                translateY: 0,
                duration: 300
            })
        },
        resetOn () {
            anime({
                targets: this.switchElement,
                translateY: 20,
                duration: 300
            })
        },
        toggleLight () {
            if (!this.lightOn) {
                this.resetOn()
                this.lightElement.style.opacity = 1
            } else {
                this.resetOff()
                this.lightElement.style.opacity = 0
            }
            this.lightOn = !this.lightOn
        }
    }
}
</script>

<style scoped>
#abajour {
    pointer-events: none;
}
#lamp * {
    position: absolute;
    width: 18vw;
}
#light {
    opacity: 0;
}
#switch {
    cursor: grab;
    width: 1vw;
    left: 10.5vw;
    top: 1vw;
}
</style>
