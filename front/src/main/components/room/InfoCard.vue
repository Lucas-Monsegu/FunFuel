<template>
    <div>
        <img
            src="@/main/assets/room/painting_info.svg"
            id='painting_info'
        />
        <div
            id="game_title"
            :class="{ hidden: askPass }"
        >
            <div id="titleContainer">
                <v-tooltip top>
                    <template v-slot:activator="{ on }">
                        <div
                            v-on="on"
                            id="titleText"
                        >
                            {{ roomName }}
                        </div>
                    </template>
                    {{ roomName }}
                </v-tooltip>
                <div
                    id="titlePlayers"
                    class="text-center"
                >
                    <v-progress-linear
                        :value="barProgress"
                        height="20"
                        color="#3498db"
                    >
                        <v-icon medium>mdi-account</v-icon>
                        <strong>{{ getPlayersString }}</strong>
                    </v-progress-linear>
                </div>
                <div>
                    <v-btn
                        class="ma-2"
                        outlined
                        rounded
                        color="white"
                        @click="copyClipboard"
                    >
                        <v-icon left>mdi-link</v-icon>
                        Link
                    </v-btn>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    props: {
        askPass: Boolean
    },
    data () {
        return {
            unsubscribe: _ => { },
            autoCopy: true
        }
    },
    computed: {
        barProgress () {
            return this.numberPlayers / this.maxPlayers * 100
        },
        getPlayersString () {
            return `${this.numberPlayers || 0}/${this.maxPlayers || 0}`
        },
        inviteLink () {
            return `${process.env.VUE_APP_FRONTURL}/${this.$route.params.game}/${this.$route.params.token}`
        },
        ...mapGetters(['maxPlayers', 'numberPlayers', 'roomName'])
    },
    methods: {
        copyClipboard () {
            const el = document.createElement('textarea')
            el.value = this.inviteLink
            document.body.appendChild(el)
            el.select()
            document.execCommand('copy')
            document.body.removeChild(el)
            this.$store.commit('addSnack', { text: 'Link copied to clipboard 🔗' })
        }
    }
}
</script>

<style scoped>
.hidden {
    display: none;
}
#titleContainer {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
}
#painting_info {
    position: absolute;
    width: 15vw;
    left: 1.25vw;
    top: 5%;
}
#game_title {
    margin: 1vw;
    position: absolute;
    width: 13vw;
    left: 1.25vw;
    top: 5%;
    height: 7.239vw;
    text-align: center;
}
#titleText {
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
    font-family: "Mont";
    white-space: nowrap;
}
#titlePlayers {
    padding: 0 0.5vw 0 0.5vw;
}
</style>
