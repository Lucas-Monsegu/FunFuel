<template>
    <v-overlay
        :value="overlay"
        :opacity="opacity"
        :z-index="10"
    >
        <div
            :id="statename"
            :style="style"
        />
    </v-overlay>
</template>

<script>
import Lottie from 'lottie-web'

export default {
    props: {
        name: {
            type: String,
            default: 'check'
        },
        width: Number,
        height: Number,
        speed: {
            type: Number,
            default: 1
        },
        opacity: {
            type: Number,
            default: 1
        },
        offset: {
            type: Number
        }
    },
    data () {
        return {
            overlay: false,
            anim: null,
            loaded: false,
            style: {
                width: this.width ? `${this.width}px` : '100%',
                height: this.height ? `${this.height}px` : '100%'
            }
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
                this.overlay = true
                setTimeout(_ => {
                    this.anim = Lottie.loadAnimation({
                        container: document.getElementById(this.statename),
                        renderer: 'svg',
                        loop: false,
                        autoplay: false,
                        path: `/anims/${this.name}.json`
                    })
                    this.anim.setSpeed(this.speed)
                    this.anim.onComplete = _ => {
                        this.$store.commit(this.statename, 'finished')
                        this.loaded = false
                        this.overlay = false
                        this.anim.destroy()
                    }
                    this.anim.play()
                })
            } else {
                this.anim.play()
            }
        },
        load () {
            setTimeout(_ => {
                this.overlay = true
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
                    this.overlay = false
                }
            })
        },
        pause () {
            this.anim.pause()
        }
    }
}
</script>
