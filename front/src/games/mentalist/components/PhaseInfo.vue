<template>
    <div
        id='phaseinfo'
        v-show="show"
    >
        <div class='letters'>
            {{text}}
        </div>
    </div>
</template>

<script>
import anime from 'animejs'
export default {
    data () {
        return {
            text: '',
            show: false
        }
    },
    methods: {
        animate (text) {
            this.show = true
            this.text = text
            anime.timeline()
                .add({
                    targets: '.letters',
                    opacity: [0, 1],
                    scale: [0.2, 1],
                    duration: 800
                }).add({
                    targets: '.letters',
                    opacity: 0,
                    scale: 1,
                    duration: 600,
                    easing: 'easeInExpo',
                    delay: 500
                }).finished.then(_ => {
                    this.show = false
                })
        }
    }
}
</script>

<style scoped>
#phaseinfo {
    text-align: center;
    position: relative;
    position: relative;
}
.letters {
    font-weight: 900;
    font-size: 4.5em;
    opacity: 0;
}
</style>
