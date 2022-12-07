<template>
    <div
        id="card"
        @click="click"
    >
        <div id="card-inner">
            <img
                id="front"
                src="@/main/assets/homepage/card/card_heart.svg"
                ondragstart="return false;"
            />
            <img
                id="back"
                ondragstart="return false;"
                :src="getUrl(backSrc)"
            />
        </div>
    </div>
</template>

<script>
import anime from 'animejs'
export default {
    data () {
        return {
            backSrc: 'card_clown.svg',
            backSrcs: [
                'card_joker.svg',
                'card_it.svg',
                'card_batman.svg',
                'card_clown.svg'
            ],
            anim: null,
            reverse: false,
            locked: false
        }
    },
    mounted () {
        this.anim = anime.timeline({
            autoplay: false
        })
        this.anim.add({
            targets: '#card-inner',
            rotateY: '180deg',
            duration: 300,
            easing: 'linear'
        })
    },
    computed: {
        remainingSrcs () {
            return this.backSrcs.filter(el => el !== this.backSrc)
        }
    },
    methods: {
        getUrl (img) {
            return require(`@/main/assets/homepage/card/${img}`)
        },
        selectRandomBack () {
            this.backSrc = this.remainingSrcs[Math.floor(Math.random() * this.remainingSrcs.length)]
        },
        click () {
            if (this.locked) return
            this.locked = true
            this.anim.finished.then(_ => {
                this.locked = false
            })
            if (this.reverse) {
                this.anim.reverse()
            }
            if (!this.anim.reversed) {
                this.selectRandomBack()
            }
            this.reverse = true
            this.anim.play()
        }
    }
}
</script>

<style scoped>
#card {
    perspective: 180px;
}
#card-inner {
    transition: 0.3s;
    transform-style: preserve-3d;
    position: relative;
}
#card,
#front,
#back {
    height: 122px;
    width: 81px;
}
#front,
#back {
    backface-visibility: hidden;
    position: absolute;
    top: 0;
    left: 0;
}
#back {
    transform: rotateY(180deg);
}
</style>
