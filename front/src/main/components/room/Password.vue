<template>
    <v-card
        id="passCard"
        flat
        color="transparent"
    >
        <div id='passwordRequired'>
        </div>
        <animdiv
            name="lock"
            autolock
            :offset="23"
            :speed="1.5"
        >
        </animdiv>
        <div id="passText">
            Password Required
            <v-text-field
                v-model="password"
                :type="hiddenPassword ? 'password' : 'text'"
                outlined
                autofocus
                :color="color"
                :append-icon="hiddenPassword ?  'mdi-eye-off': 'mdi-eye'"
                @click:append="toggleVisibility"
                @keypress.enter="sendPassword"
                autocomplete="off"
                :hint="comment"
            >
            </v-text-field>
        </div>
    </v-card>
</template>

<script>
import animdiv from '@/utils/components/anim/AnimDiv'
import Random from '@/utils/js/Random'
import { mapGetters } from 'vuex'

export default {
    data () {
        return {
            password: '',
            hiddenPassword: true,
            color: '#3498db',
            unsubscribe: _ => { },
            comment: '',
            invalidPasswordErrorComment: [
                'You can do it.',
                'Don\'t expect things to go right the first time.',
                'Take your time, it\'s not like your friends are waiting',
                'You\'ll make it I\'m sure.',
                'Is your keyboard plugged ?',
                'Tells those fingers what to do.',
                'Check caps lock idk',
                'Did Kitty just jump on the keyboard ?',
                '2 tries remaining before self-destruction.',
                'If you need help typing your password, contact us at: funfuel.io@gmail.com',
                'Come on at this point we both know you are trying every possibilities',
                'Are you a random text generator ?',
                'This time it was so close.',
                '“To make a error is human; pushing the same error is dumb.”'
            ]
        }
    },
    components: {
        animdiv
    },
    mounted () {
        this.$store.commit('animlock', 'load')
        this.unsubscribe = this.$store.subscribe((mutation, state) => {
            if (mutation.type === 'wsMsg') {
                const msg = JSON.parse(mutation.payload.data)
                switch (msg.command) {
                    case 'Connected':
                        this.goodPassword()
                        break
                    case 'InvalidPassword':
                        this.wrongPassword()
                        break
                }
            }
        })
    },
    destroyed () {
        this.$store.commit('animlock', 'finished')
    },
    watch: {
        animlock (s) {
            if (s === 'finished') { this.$emit('hidePass') }
        }
    },
    methods: {
        sendPassword () {
            this.$store.dispatch('sendPassword', this.password)
            this.password = ''
        },
        toggleVisibility () {
            this.hiddenPassword = !this.hiddenPassword
        },
        wrongPassword (msg) {
            this.comment = Random.fromArray(this.invalidPasswordErrorComment)
            this.color = '#e74c3c'
            setTimeout(_ => { this.color = '#3498db' }, 1000)
        },
        goodPassword () {
            this.color = '#2ecc71'
            this.$store.commit('animlock', 'play')
        }
    },
    computed: {
        ...mapGetters(['animlock'])
    }
}
</script>

<style scoped>
#passwordRequired {
    position: absolute;
    top: 20%;
    width: 100%;
}
#passCard {
    width: 30vw;
    height: 10vw;
}
#passText {
    position: absolute;
    top: 50%;
    left: 30%;
    width: 70%;
    transform: translateY(-50%);
    text-align: center;
    font-family: "Mont";
    font-size: 2.5vw;
}
#animlock {
    position: absolute;
    height: 100%;
    width: 66%;
    transform: translate(-33%);
}
</style>
