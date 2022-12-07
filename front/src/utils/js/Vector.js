import Random from './Random'

export default class Vector {
    static magnitude (v) {
        return Math.sqrt(v.x ** 2 + v.y ** 2)
    }

    static random (angleMin, angleMax) {
        var random = Random.range(angleMin, angleMax)
        return { x: Math.cos(random), y: Math.sin(random) }
    }

    static normalize (v) {
        const magnitude = Vector.magnitude(v)
        return { x: v.x / magnitude, y: v.y / magnitude }
    }

    static minus (v1, v2) {
        return {
            x: v1.x - v2.x, y: v1.y - v2.y
        }
    }

    static dot (v1, v2) {
        return v1.x * v2.x + v1.y * v2.y
    }

    static dist (p1, p2) {
        return Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2)
    }

    static angleDiffToX (v) {
        return -Math.PI / 2 - Math.atan2(v.x, v.y)
    }

    static fromPolar (r, teta) {
        return {
            x: r * Math.cos(teta), y: r * Math.sin(teta)
        }
    }
}
