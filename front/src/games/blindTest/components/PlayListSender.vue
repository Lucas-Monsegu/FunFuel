<template>
    <div>
        <v-card
            tile
            class='py-5'
        >
        </v-card>
        <v-card tile>
            <v-row>
                <v-col
                    cols="4"
                    class='py-0'
                >
                    <div class='mainInput'>
                        <v-text-field
                            label="Answer Type"
                            v-model="answerType"
                            outlined
                            hint="(Music, Artist, Movies ...)"
                            :error="answerType === ''"
                        ></v-text-field>
                    </div>
                </v-col>
                <v-col
                    cols="8"
                    class='py-0'
                >
                    <div class='mainInput'>
                        <v-text-field
                            label="BlindTest name"
                            v-model="playListName"
                            @change="ChangePlayListName"
                            :success="playListNameAlreadyExist===false && playListName !== ''"
                            :error="playListNameAlreadyExist"
                            :loading="playListNameLoading"
                            :error-messages="playListNameAlreadyExist ? 'This name is already taken' : ''"
                            outlined
                        ></v-text-field>
                    </div>
                </v-col>

            </v-row>
            <v-row class='pt-0 pb-5'>

                <v-col cols="10"></v-col>
                <v-col>
                    <v-btn
                        id='addButton'
                        color="success"
                        dark
                        large
                        @click="addSong()"
                    >
                        ADD SONG
                    </v-btn>
                </v-col>
            </v-row>
            <v-row
                v-for="(song, index) in playList"
                :key="index"
            >
                <v-col
                    cols="3"
                    class='py-0'
                >
                    <v-row class="pr-3">
                        <v-col
                            cols=2
                            class="pa-0"
                            style="height: 56px"
                        >
                            <v-icon
                                class='centerIcon'
                                :color="isRowGood(song) ? 'success' : 'error'"
                            >{{isRowGood(song) ? 'mdi-check-circle' : 'mdi-close-circle'}}</v-icon>
                        </v-col>
                        <v-col class="pa-0">
                            <v-text-field
                                label="Answer"
                                v-model="song.answer"
                                :error="song.answer===''"
                                outlined
                            ></v-text-field>
                        </v-col>
                    </v-row>
                </v-col>
                <v-col
                    cols="6"
                    class='py-0'
                >
                    <v-text-field
                        label="Youtube url"
                        v-model="song.url"
                        outlined
                        :error="song.urlErrorMessage !== ''"
                        :error-messages="song.urlErrorMessage"
                        :loading="song.urlLoading"
                        @change="UrlErrorDetection(index)"
                    ></v-text-field>
                </v-col>
                <v-col
                    cols="3"
                    class='py-0'
                >
                    <v-row class="pr-3">
                        <v-col class="pa-0">
                            <v-text-field
                                label="Starting time"
                                v-model="song.startTime"
                                outlined=""
                                type="time"
                                suffix="MM:SS"
                            ></v-text-field>
                        </v-col>
                        <v-col class="pa-0">
                            <v-text-field
                                label="duration"
                                v-model="song.duration"
                                outlined
                                hint="5 <= duration <= 30"
                                suffix="SS"
                                :rules="[ruleDuration]"
                            ></v-text-field>
                        </v-col>
                        <v-col
                            cols=2
                            class="pa-0 pl-4"
                            style="height: 56px"
                        >
                            <div class='centerIcon'>
                                <v-btn
                                    icon
                                    color='error'
                                    @click="remove(index)"
                                >
                                    <v-icon>mdi-delete</v-icon>
                                </v-btn>
                            </div>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <div class='text-center'>
                        <v-btn
                            x-large
                            color="success"
                            dark
                            :disabled="!sendable()"
                            @click="verification = true"
                        >Send</v-btn>
                    </div>
                    <div
                        style='text-align: center;'
                        v-if="!sendable()"
                    >All rows must be valid and there must be at least 10</div>
                </v-col>
            </v-row>
        </v-card>
        <v-dialog
            v-model="verification"
            max-width="520px"
        >
            <v-card>
                <v-card-title>
                    Are you sure the blind test is valid and complete ?
                </v-card-title>
                <v-card-text>
                    <span>
                        Once sent no modification will be possible.
                        <br />
                        Then your blindTest will be reviewed by us and if validated, will be added to the list for everyone
                    </span>
                </v-card-text>
                <v-card-actions>
                    <v-btn
                        color="green-darken-1"
                        text
                        @click="verification = false"
                    >
                        Close
                    </v-btn>
                    <v-spacer></v-spacer>

                    <v-btn
                        color="green"
                        text
                        @click="sendPlayList()"
                    >
                        Send
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'

export default {
    data () {
        return {
            verification: false,
            playList: [],
            answerType: '',
            playListName: '',
            playListNameLoading: false,
            playListNameAlreadyExist: undefined,
            playListChange: false
        }
    },
    methods: {
        addSong () {
            const song = { answer: '', url: '', startTime: '00:00', urlErrorMessage: 'Invald Youtube URL', duration: '30' }
            this.playList.push(song)
        },
        UrlErrorDetection (index) {
            if (this.isVideoExist(this.playList[index].url)) {
                this.playList[index].urlErrorMessage = ''
            } else {
                this.playList[index].urlErrorMessage = 'Invalid Youtube URL'
            }
        },
        getYoutubeId (url) {
            url = url.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/)
            return (url[2] !== undefined) ? url[2].split(/[^0-9a-z_-]/i)[0] : ''
        },
        isVideoExist (youtubeLink) {
            const id = this.getYoutubeId(youtubeLink)
            if (!id) {
                return false
            }
            return true
        },
        stringToSeconds (str) {
            const r = str.split(':').map(x => parseInt(x))
            return r[0] * 60 + r[1]
        },
        isRowGood (song) {
            return song.answer !== '' && song.urlErrorMessage === '' && this.ruleDuration(song.duration)
        },
        async ChangePlayListName () {
            this.playListChange = true
            this.playListNameLoading = true
            // `https://funfuelbucket.s3.amazonaws.com/blindtest/${name}/index.json
            try {
                const res = await axios.get(`https://funfuelbucket.s3.amazonaws.com/blindtest/${this.playListName}/index.json`)
                if (res.status === 200) {
                    this.playListNameAlreadyExist = true
                } else {
                    this.playListNameAlreadyExist = false
                }
            } catch (error) {
                this.playListNameAlreadyExist = false
            } finally {
                this.playListNameLoading = false
            }
        },
        remove (index) {
            this.playList.splice(index, 1)
        },
        ruleDuration (e) {
            try {
                const t = parseInt(e)
                return t >= 5 && t <= 30 && t.toString() === e
            } catch {
                return false
            }
        },
        sendable () {
            return this.playList.every(song => { return this.isRowGood(song) }) && this.answerType !== '' && this.playListNameAlreadyExist === false && this.playList.length >= 1
        },
        sendPlayList () {
            const goodPlayList = []
            this.verification = false
            for (const song of this.playList) {
                goodPlayList.push({ answer: song.answer, url: song.url, startTime: this.stringToSeconds(song.startTime), duration: song.duration })
            }
            this.ws.send(JSON.stringify({
                command: 'CreatePlayList',
                playListName: this.playListName,
                answerType: this.answerType,
                playList: goodPlayList
            }))
            setTimeout(() => {
                this.ws.send(JSON.stringify({ command: 'IsBlocked' }))
            }, 1000)
        }
    },
    watch: {
        playListName (oldval, newval) {
            this.playListNameAlreadyExist = undefined
        }
    },
    computed: {
        ...mapGetters(['ws', 'isMaster'])
    },
    mounted () {
        this.addSong()
    }

}
</script>

<style scoped>
.mainInput {
    position: relative;
    width: 50%;
    left: 25%;
}
.rowdiv {
    text-align: center;
    justify-content: center;
}
.centerIcon {
    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
</style>
