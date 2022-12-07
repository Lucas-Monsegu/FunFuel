<template>
    <canvas
        :class="canvasClass"
        :id="canvasId"
        :style="getStyle()"
    >
    </canvas>
</template>

<script>
export default {
    props: {
        canvasClass: String,
        canvasId: String,
        zIndex: Number,
        top: Number,
        left: Number,
        width: Number,
        height: Number
    },
    data () {
        return {
            canvas: null
        }
    },
    methods: {
        setCanvasSize () {
            this.canvas.width = window.innerWidth * 2
            this.canvas.height = window.innerHeight * 2
            this.canvas.style.width = window.innerWidth + 'px'
            this.canvas.style.height = window.innerHeight + 'px'
            this.canvas.getContext('2d').scale(2, 2)
        },
        getStyle () {
            return {
                position: 'fixed',
                top: `${this.top}px`,
                left: `${this.top}px`,
                width: `${this.width} %`,
                height: `${this.height} %`,
                zIndex: this.zIndex,
                pointerEvents: 'none'
            }
        }
    },
    mounted () {
        this.canvas = document.getElementById(this.canvasId)
        this.setCanvasSize()
        window.addEventListener('resize', this.setCanvasSize, false)
    }
}
</script>
