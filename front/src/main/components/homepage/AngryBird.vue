<template>
    <div>
        <img
            id="bird"
            src="@/main/assets/homepage/angrybird/bird.svg"
            @mousedown="down"
        />
    </div>
</template>

<script>
import anime from 'animejs'
import Vector from '@/utils/js/Vector'
export default {
    data () {
        return {
            gravity: 0,
            birdElement: null,
            birdRect: null,
            downPoint: null,
            direction: null,
            percentage: 0,
            isdragged: false,
            endAnimPercent: 0,
            maxY: 0
        }
    },
    mounted () {
        this.birdElement = document.getElementById('bird')
        this.getBirdRect()
        document.onmousemove = this.move
        document.onmouseup = this.up
    },
    methods: {
        getBirdRect () {
            this.birdRect = this.birdElement.getBoundingClientRect()
        },
        down (e) {
            if (e.preventDefault) e.preventDefault()
            this.isdragged = true
            this.downPoint = { x: e.x, y: e.y }
            this.maxY = document.body.scrollHeight - this.birdRect.bottom - 10
        },
        move (e) {
            if (this.isdragged) {
                const dir = Vector.minus(e, this.downPoint)
                const mag = Vector.magnitude(dir)
                let dx = dir.x
                let dy = dir.y
                if (mag > 50) {
                    const dnorm = Vector.normalize(dir)
                    dx = dnorm.x * 50
                    dy = dnorm.y * 50
                }
                const angle = Vector.angleDiffToX({ x: dx, y: dy })
                this.birdElement.style.transform =
                    `translate(${dx}px, ${dy}px) rotate(${angle}rad)`
            }
        },
        reset () {
            this.percentage = 0
            this.gravity = 0
        },
        up (e) {
            if (this.isdragged) {
                this.isdragged = false
                const dir = Vector.minus(this.downPoint, e)
                const mag = Vector.magnitude(dir)
                let dx = dir.x
                let dy = dir.y
                if (mag > 50) {
                    const dnorm = Vector.normalize(dir)
                    dx = dnorm.x * 50
                    dy = dnorm.y * 50
                }
                this.direction = { x: dx, y: dy }
                this.throwBird()
            }
        },
        updateBird (anim) {
            const grav = this.gravity ** 2 * 0.4
            let x = this.percentage * this.direction.x * 0.2
            let y = this.percentage * this.direction.y * 0.2 + (grav)
            const angle = Vector.angleDiffToX({ x: -x, y: -y })
            x -= this.direction.x
            y -= this.direction.y
            y = Math.min(y, this.maxY)
            this.birdElement.style.transform = `translate(${x}px, ${y}px) rotate(${angle}rad)`
        },
        updateBirdEnd (anim) {
            this.birdElement.style.transform = `scale(${this.endAnimPercent})`
        },
        throwBird () {
            const anim1 = anime({
                targets: this,
                percentage: [
                    { value: 100, duration: 2000 }
                ],
                gravity: [
                    { value: 100, easing: 'linear', duration: 2000 }
                ],
                update: this.updateBird,
                easing: 'easeOutCubic',
                complete: this.reset
            })
            anim1.finished.then(_ => {
                anime({
                    targets: this,
                    endAnimPercent: [0, 1],
                    duration: 400,
                    update: this.updateBirdEnd
                })
            })
        }
    }
}
</script>

<style scoped>
#bird {
    width: 50px;
    height: 46px;
    position: absolute;
}
</style>
