<template>
    <div id="golf">
        <img
            @click="click"
            id="ball"
            src="@/main/assets/homepage/golf/golf_ball.svg"
            ondragstart="return false;"
        />
        <img
            id="support"
            src="@/main/assets/homepage/golf/golf_support.svg"
            ondragstart="return false;"
        />
    </div>
</template>

<script>
import anime from 'animejs'
export default {
    data () {
        return {
            locked: false,
            flagBottomLeft: null,
            ballCenter: null
        }
    },
    mounted () {
        this.getPositions()
    },
    methods: {
        getPositions () {
            const flag = document.getElementById('flag').getBoundingClientRect()
            this.flagBottomLeft = { x: flag.left, y: flag.bottom }
            const ball = document.getElementById('ball').getBoundingClientRect()
            this.ballCenter = { x: ball.left + 20, y: ball.top + 20 }
        },
        bump () {
            if (this.locked) return
            anime({
                targets: '#ball',
                translateY: [
                    { value: -30, duration: 100 },
                    { value: 0 }
                ],
                easing: 'easeOutExpo'
            })
        },
        intersects (a, b, c, d, p, q, r, s) {
            var det, gamma, lambda
            det = (c - a) * (s - q) - (r - p) * (d - b)
            if (det === 0) {
                return false
            } else {
                lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det
                gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det
                return (lambda > 0 && lambda < 1) && (gamma > 0 && gamma < 1)
            }
        },
        click (e) {
            if (this.locked) return
            this.locked = true
            const x = e.x
            const y = e.y
            const vecx = 20 - e.offsetX
            const vecy = 20 - e.offsetY
            const vecmag = this.magnitude(vecx, vecy)
            const normalizedVec = { x: vecx / vecmag, y: vecy / vecmag }
            const magCorner = this.getDistanceFromCorner(x, y)
            const win = this.intersects(
                this.ballCenter.x,
                this.ballCenter.y,
                this.ballCenter.x + normalizedVec.x * magCorner,
                this.ballCenter.y + normalizedVec.y * magCorner,
                this.flagBottomLeft.x,
                this.flagBottomLeft.y + 20,
                this.flagBottomLeft.x,
                this.flagBottomLeft.y - 40)
            let anim
            if (win) {
                anim = anime({
                    targets: '#ball',
                    translateX: [
                        { value: this.flagBottomLeft.x + 15 - this.ballCenter.x, duration: 800 },
                        { value: 0, duration: 1, delay: 100 }
                    ],
                    translateY: [
                        { value: this.flagBottomLeft.y - 20 - this.ballCenter.y, duration: 800 },
                        { value: 0, duration: 1, delay: 100 }
                    ],
                    scaleX: [
                        { value: 0, duration: 100, delay: 800 },
                        { value: 1, duration: 300, easing: 'easeOutElastic' }
                    ],
                    scaleY: [
                        { value: 0, duration: 100, delay: 800 },
                        { value: 1, duration: 300, easing: 'easeOutElastic' }
                    ],
                    easing: 'easeOutCubic'
                })
            } else {
                anim = anime({
                    targets: '#ball',
                    translateX: [
                        { value: normalizedVec.x * magCorner, duration: 800 },
                        { value: 0, duration: 0 }
                    ],
                    translateY: [
                        { value: normalizedVec.y * magCorner, duration: 800 },
                        { value: 0, duration: 0 }
                    ],
                    scale: [
                        { value: 0, duration: 1, delay: 800 },
                        { value: 1, duration: 300, easing: 'easeOutElastic' }
                    ],
                    easing: 'easeOutCubic'
                })
            }
            if (win) {
                setTimeout(_ => {
                    this.$emit('win')
                    setTimeout(() => { this.$store.dispatch('unlockAchievement', 'ca330cf29b774e2f3f84') }, 400)
                }, 900)
            }
            anim.finished.then(_ => {
                this.locked = false
            })
        },
        getDistanceFromCorner (x, y) {
            const xt = window.innerWidth - x
            const yt = window.innerHeight - y
            return this.magnitude(xt, yt)
        },
        magnitude (x, y) {
            return Math.sqrt(x ** 2 + y ** 2)
        }
    }
}
</script>

<style scoped>
#golf,
#golf img {
    width: 42px;
    height: 71px;
    position: absolute;
}
#ball {
    z-index: 1;
}
</style>
