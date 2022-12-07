<template>
    <div id="word">
        <div v-if="!mentalist">
            <div>
                Your word is:
            </div>
            <div id="w">
                {{ word }}
            </div>
        </div>
        <div
            v-else
            id="word"
        >
            <v-text-field
                id="guessInput"
                v-if="guess"
                v-model="myWord"
                @keypress.enter="send"
                @blur="guess = false"
                label="Your guess"
                outlined
                maxlength="30"
                autofocus
                color="white"
                autocomplete="off"
                append-icon="mdi-keyboard-return"
                hide-details
            ></v-text-field>
            Your are Mentalist
            <v-btn
                outlined
                id="guessBtn"
                @click="guess = true"
            >
                Make my guess
            </v-btn>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    name: 'word',
    props: {
        word: {
            type: String
        },
        mentalist: {
            type: Boolean,
            required: true
        }
    },
    data () {
        return {
            guess: false,
            myWord: ''
        }
    },
    methods: {
        send () {
            this.ws.send(JSON.stringify({ command: 'MrWhiteQuickSay', word: this.myWord }))
        }
    },
    computed: {
        ...mapGetters(['ws'])
    }
}
</script>

<style scoped>
#word {
    font-family: "Mont";
    text-align: center;
}
#w {
    font-size: 2em;
}
#guessBtn {
    margin-top: 8px;
    margin: auto;
    display: block;
}
#guessInput {
    display: block;
    margin: auto;
}
</style>
