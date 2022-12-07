import anime from 'animejs'
import Random from '@/utils/js/Random'
import Vector from '@/utils/js/Vector'
export default class FireParticles {
    constructor (canvasId) {
        this.canvas = document.getElementById(`${canvasId}`)
        const ctx = this.canvas.getContext('2d')
        this.ctx = ctx

        this.render = anime({
            duration: Infinity,
            update: () => {
                ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
            }
        })
    }

    circle (x, y, radius, color) {
        const p = {}
        p.x = x
        p.y = y
        p.color = color
        p.radius = radius
        p.alpha = 0.8
        p.lineWdith = 6
        const r = Vector.normalize(Vector.random(3.926, 5.497))
        const speed = Random.range(100, 250)
        p.endPos = { x: x + r.x * speed, y: y + r.y * speed }
        const ctx = this.ctx
        p.draw = function () {
            ctx.globalAlpha = p.alpha
            ctx.beginPath()
            ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, true)
            ctx.fillStyle = p.color
            ctx.fill()
        }
        return p
    }

    renderParticles (anim) {
        for (let i = 0; i < anim.animatables.length; ++i) {
            anim.animatables[i].target.draw()
        }
    }

    animateParticles (startX, startY) {
        const particles = []
        const colors = ['#e57f39', '#ed913e', '#f4a845', '#ffbe55']
        for (let i = 0; i < 10; ++i) {
            particles.push(this.circle(startX, startY, 1 + Math.random() * 4, colors[Random.int(0, colors.length)]))
        }
        anime.timeline().add({
            targets: particles,
            x: (p) => { return p.endPos.x },
            y: (p) => { return p.endPos.y },
            duration: 1500,
            alpha: [
                { value: 1 },
                { value: 1 },
                { value: 0 }
            ],
            easing: 'easeOutQuad',
            update: this.renderParticles
        })
    }
}
