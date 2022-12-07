<template>
    <div :id="`anim${name}`" />
</template>

<script>
import Lottie from 'lottie-web'

export default {
    props: {
        name: {
            type: String,
            default: 'check'
        },
        speed: {
            type: Number,
            default: 1
        },
        autolock: {
            type: Boolean,
            default: false
        },
        offset: {
            type: Number
        },
        loop: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            anim: null,
            loaded: false
        }
    },
    watch: {
        state (command) {
            switch (command) {
                case 'play':
                    this.play()
                    break
                case 'load':
                    this.load()
                    break
                case 'pause':
                    this.pause()
                    break
                case 'finished':
                    this.anim.destroy()
                    this.loaded = false
            }
        }
    },
    computed: {
        state () {
            return this.$store.getters[this.statename]
        },
        statename () {
            return `anim${this.name}`
        }
    },
    methods: {
        play () {
            if (!this.loaded) {
                setTimeout(_ => {
                    this.anim = Lottie.loadAnimation({
                        container: document.getElementById(this.statename),
                        renderer: 'svg',
                        loop: this.loop,
                        autoplay: false,
                        path: `/anims/${this.name}.json`
                    })
                    this.anim.setSpeed(this.speed)
                    this.anim.onComplete = _ => {
                        this.$store.commit(this.statename, 'finished')
                        this.anim.destroy()
                        this.loaded = false
                    }
                    if (this.offset) {
                        this.anim.goToAndPlay(this.offset, true)
                    } else {
                        this.anim.play()
                    }
                })
            } else {
                this.anim.play()
            }
        },
        load () {
            setTimeout(_ => {
                this.anim = Lottie.loadAnimation({
                    container: document.getElementById(this.statename),
                    renderer: 'svg',
                    loop: false,
                    autoplay: false,
                    path: `/anims/${this.name}.json`
                })
                this.loaded = true
                this.anim.setSpeed(this.speed)
                this.anim.onComplete = _ => {
                    this.$store.commit(this.statename, 'finished')
                    this.anim.destroy()
                    this.loaded = false
                }
                if (this.offset) {
                    this.anim.goToAndStop(this.offset, true)
                }
            })
        },
        pause () {
            this.anim.pause()
        }
    }
}
</script>
