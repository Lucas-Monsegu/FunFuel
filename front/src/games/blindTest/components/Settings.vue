<template>
    <div>
        <v-row class='pa-0'>
            <v-col
                cols="6"
                class='pa-0 xs6'
                no-gutters
            >
                <v-slider
                    v-model="numberSongs"
                    thumb-label="always"
                    :thumb-size="24"
                    label="NbSongs"
                    min=5
                    max=50
                    color="#3498DB"
                    hide-details
                    @change="sendOptions"
                    :readonly="!isMaster"
                ></v-slider>
            </v-col>

            <v-col
                class='pa-0'
                no-gutters
            >
                <div class='text-center pb-2'>
                    <v-tooltip
                        top
                        :disabled="isCreationPossible()"
                    >
                        <template v-slot:activator="{ on }">
                            <span v-on="on">
                                <v-btn
                                    @click="clickDialog()"
                                    :hint="isCreationPossible() ? '' : 'You need to be the master and logged in'"
                                    :disabled="!isCreationPossible()"
                                    v-on="on"
                                    small
                                >Create BlindTest</v-btn>
                            </span>
                        </template>
                        <span>You must be logged in and master of the room</span>
                    </v-tooltip>
                </div>
            </v-col>

        </v-row>
        <v-dialog
            v-model="dialog"
            fullscreen
            hide-overlay
            transition="dialog-bottom-transition"
            scrollable
        >
            <v-card>
                <div style="flex-basis: 0%">
                    <v-toolbar
                        flat
                        dark
                        dense
                        color="green"
                    >
                        <v-btn
                            icon
                            dark
                            @click="dialog = false"
                        >
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                        <v-toolbar-title>BlindTest Submitions</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-toolbar-items>
                            <v-btn
                                dark
                                text
                                @click="dialog = false"
                            >
                                close
                            </v-btn>
                        </v-toolbar-items>
                    </v-toolbar>
                </div>
                <v-card-text>
                    <PlayListSender></PlayListSender>
                </v-card-text>
            </v-card>
        </v-dialog>
        <v-autocomplete
            v-model="selectedPlayLists"
            :items="availablePlayLists"
            outlined
            dense
            filled
            :disabled="!isMaster"
            small-chips
            label="BlindTests"
            deletable-chips
            eager
            multiple
            @change="sendOptions"
        >
            <template v-slot:item="data">

                <v-list-item-content
                    style="text-transform:capitalize;"
                    v-text="data.item"
                ></v-list-item-content>
                <v-list-item-content
                    style="text-transform:capitalize;"
                    v-text="` (${answers[data.item]})`"
                ></v-list-item-content>

            </template>
        </v-autocomplete>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PlayListSender from './PlayListSender'
import axios from 'axios'
export default {
    components: { PlayListSender },
    data () {
        return {
            numberSongs: 15,
            dialog: false,
            unsubscribe: () => { },
            selectedPlayLists: [],
            answers: {},
            availablePlayLists: [],
            isBlocked: false
        }
    },
    async mounted () {
        const res = await axios.get('https://funfuelbucket.s3.eu-west-3.amazonaws.com/blindtest/playLists.json')
        this.availablePlayLists = Object.keys(res.data)
        this.answers = res.data
        setTimeout(() => {
            if (this.ws) {
                this.ws.send(JSON.stringify({ command: 'IsBlocked' }))
            }
        }, 200)
        this.unsubscribe = this.$store.subscribe((mutation, state) => {
            if (mutation.type === 'wsMsg') {
                const msg = JSON.parse(mutation.payload.data)
                switch (msg.command) {
                    case 'ErrorCreatePlayList':
                        this.$store.commit('addSnack', { text: msg.reason, color: 'error' })
                        break
                    case 'PlayListSuccess':
                        this.$store.commit('addSnack', { text: msg.reason })
                        break
                    case 'IsBlocked':
                        this.isBlocked = msg.value
                        break
                }
            }
        })
    },
    destroyed () {
        this.unsubscribe()
    },
    methods: {
        sendOptions () {
            this.ws.send(JSON.stringify({

                command: 'SetOptions', numberOfSongs: this.numberSongs, playLists: this.selectedPlayLists
            }))
        },
        setOptions (options) {
            this.selectedPlayLists = options.playLists
            this.numberSongs = options.numberOfSongs
        },
        isCreationPossible () {
            if (!this.playersData || !this.playersData[this.publicId] || this.isBlocked) {
                return false
            }
            return this.isMaster && this.playersData[this.publicId].userData.level > 0
        },
        clickDialog () {
            if (this.isCreationPossible()) {
                this.dialog = true
            }
        }
    },
    computed: {
        ...mapGetters(['ws', 'isMaster', 'playersData', 'publicId'])

    }
}
</script>

<style scoped>
</style>
