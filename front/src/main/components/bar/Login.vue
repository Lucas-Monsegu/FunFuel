<template>
    <div>
        <v-dialog
            v-model="dialog"
            hide-overlay
            width="0"
        >
            <template v-slot:activator="{ on }">
                <v-btn
                    text
                    small
                    v-on="on"
                >
                    Login
                </v-btn>
            </template>

        </v-dialog>
        <a @click="login('discord')">
            <img
                src="@/main/assets/homepage/login/discord2.svg"
                id="logindiscord"
                class="loginicon"
            >
        </a>
        <a @click="login('google')">
            <img
                src="@/main/assets/homepage/login/google2.svg"
                id="logingoogle"
                class="loginicon"
            >
        </a>
    </div>
</template>

<script>
import anime from 'animejs'
export default {
    data () {
        return {
            backUrl: process.env.VUE_APP_MAINURL,
            dialog: false,
            intent: false,
            animFinished: true,
            done: true
        }
    },
    watch: {
        dialog (open) {
            if (this.animFinished) {
                if (open) this.clickLogin()
                else this.closeLogin()
            } else {
                this.intent = open
                this.done = false
            }
        }
    },
    methods: {
        login (api) {
            location.href = `${this.backUrl}/auth/${api}/?return=${process.env.VUE_APP_FRONTURL}${this.$route.path}`
        },
        doIntent () {
            if (this.done) return
            if (this.intent) this.clickLogin()
            else this.closeLogin()
        },
        clickLogin () {
            this.animFinished = false
            anime({
                targets: '.loginicon',
                scale: [{ value: 1, duration: 0 }],
                translateX: [0, -65],
                delay: anime.stagger(100),
                duration: 300
            }).finished.then(_ => {
                if (!this.done) this.doIntent()
                this.done = true
                this.animFinished = true
            })
        },
        closeLogin () {
            this.animFinished = false
            anime({
                targets: '.loginicon',
                scale: [
                    { value: 0, duration: 200, easing: 'easeInBack' },
                    { value: 1, duration: 0 }
                ],
                translateX: [
                    { value: 0, delay: 200, duration: 1 }
                ],
                duration: 200
            }).finished.then(_ => {
                if (!this.done) this.doIntent()
                this.done = true
                this.animFinished = true
            })
        }
    }
}
</script>
<style scoped>
#logindiscord {
    position: absolute;
    left: 100%;
    width: 40px;
    top: 45px;
}
#logingoogle {
    position: absolute;
    left: 100%;
    width: 40px;
    top: 100px;
}
</style>
