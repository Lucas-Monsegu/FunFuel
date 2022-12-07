<template>
    <div id="screen">
        <img
            src="@/main/assets/roomlist/board.svg"
            id="board"
            ondragstart="return false;"
        />
        <div id="roomWrapper">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                height="100"
                width="143.058"
                id='svgSpacer'
            />
            <div id="rooms">
                <div id="bandWrapper">
                    <img
                        src="@/main/assets/roomlist/band.svg"
                        id="band"
                        ondragstart="return false;"
                    >
                    <span id="bandText">
                        {{ gameTitle }}
                    </span>
                </div>
                <div id="cardsWrapper">
                    <div id="cards">
                        <roomcard
                            v-for="room in rooms"
                            class="roomcard"
                            :key="room.token"
                            :colorIndex="room.colorIndex"
                            :isPrivate="!room.isPublic"
                            :players="room.players"
                            :maxPlayers="room.maxPlayers"
                            :avatar="room.avatarUrl"
                            :name="room.name"
                            @click="joinRoom(room)"
                        />
                    </div>
                </div>
                <div id="createForm">
                    <div id="createRow">
                        <v-text-field
                            class="createCenter createName"
                            color="white"
                            v-model="name"
                            hint="Room name"
                            persistent-hint
                            required
                            autofocus
                        ></v-text-field>
                        <v-text-field
                            class="createCenter createMax"
                            persistent-hint
                            color="white"
                            v-model="maxPlayers"
                            hint="Max players"
                            v-mask="mask"
                            :rules="maxRules"
                            @change="change"
                            required
                        ></v-text-field>
                        <v-switch
                            class="createCenter createPriv"
                            v-model="isPrivate"
                            hint="Private"
                            persistent-hint
                            color="#1abc9c"
                        ></v-switch>
                        <v-text-field
                            :style="{ opacity: isPrivate ? 1 : 0, visibility: isPrivate ? 'visible' : 'hidden' }"
                            class="createCenter createPass"
                            persistent-hint
                            :rules="passRules"
                            color="white"
                            v-model="password"
                            ref="password"
                            hint="Password"
                        ></v-text-field>
                        <div class="createCenter createBtn">
                            <v-btn
                                depressed
                                :loading="loading"
                                color="#1abc9c"
                                @click="createRoom"
                                :disabled="maxPlayers > 100 || maxPlayers < 1 || (isPrivate && password.length === 0)"
                            >
                                Create
                                <v-icon right>
                                    mdi-plus
                                </v-icon>
                            </v-btn>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import roomcard from './RoomCard'
import Random from '@/utils/js/Random'
import axios from 'axios'
import { mapGetters } from 'vuex'
import { mask } from 'vue-the-mask'

export default {
    props: {
        gameTitle: String
    },
    directives: {
        mask
    },
    components: { roomcard },
    data () {
        return {
            name: 'my room',
            loading: false,
            maxPlayers: 8,
            password: '',
            isPrivate: false,
            interval: null,
            mask: '###',
            maxRules: [
                val => val <= 100 || '100 players maximum',
                val => val >= 1 || '1 player minimum'
            ],
            passRules: [
                val => val.length > 0 || 'Password required'
            ]
        }
    },
    watch: {
        isPrivate (priv) {
            if (priv) {
                this.$nextTick(_ => {
                    this.$refs.password.focus()
                })
            } else {
                this.password = ''
            }
        }
    },
    mounted () {
        this.refreshRooms()
        this.interval = setInterval(this.refreshRooms, 1000)
    },
    destroyed () {
        clearInterval(this.interval)
    },
    computed: {
        game () {
            return this.gameTitle
        },
        ...mapGetters(['rooms'])
    },
    methods: {
        change (e) {
            if (e > 100) {
                this.maxPlayers = 100
            } else if (e.length < 1 || e < 1) {
                this.maxPlayers = 1
            }
        },
        getRandomColor () {
            return Random.int(0, 8)
        },
        refreshRooms () {
            axios.get(`${process.env.VUE_APP_DISPATCHURL}/rooms?game=${this.game}`)
                .then((res) => {
                    this.$store.commit('setRooms', res.data)
                })
                .catch(_ => {
                    this.$store.commit('addSnack', { text: 'Error while refreshing the rooms list', color: 'error' })
                })
        },
        async joinRoom (room) {
            this.$router.push(`${this.game}/${room.token}`)
        },
        async createRoom () {
            this.loading = true
            const game = this.game
            if (new Date().getHours() === 1) {
                this.$store.dispatch('unlockAchievement', '1efsadglkpasgjnoiwb')
            }
            this.$store.dispatch('createRoom', {
                game: game,
                isPublic: !this.isPrivate,
                name: this.name,
                password: this.password,
                maxPlayers: parseInt(this.maxPlayers)
            }).then(token => {
                this.loading = false
                if (token) {
                    this.$router.push(`${game}/${token}`)
                }
            })
            // axios.get(`${process.env.VUE_APP_DISPATCHURL}/get-balanced-server?game=${this.gameTitle.toLowerCase()}`)
            //     .then(async (res) => {
            //         const path = res.data.path
            //         const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
            //         await axios.post(`${protocol}://${path}/create-room`,
            //             {
            //                 game: this.gameTitle.toLowerCase(),
            //                 isPublic: !this.isPrivate,
            //                 name: this.name,
            //                 password: this.password,
            //                 maxPlayers: this.maxPlayers
            //             })
            //     })
            //     .catch(function (error) {
            //         const status = error.response.status
            //         if (status === 503) {
            //             this.$store.commit('addSnack', { text: 'Servers are full please try again later', color: 'error' })
            //         } else {
            //             this.$store.commit('addSnack', { text: 'Unexpected error we will try to fix it', color: 'error' })
            //         }
            //     })
            //     .finally(_ => {
            //         this.loading = false
            //     })
        }
    }
}
</script>

<style scoped>
.createBtn {
    display: flex;
}
.createCenter {
    padding: 10px;
    margin: 0;
    height: 100%;
    align-items: center;
}
#createRow {
    height: 100%;
    display: flex;
    position: absolute;
}
#createForm {
    position: absolute;
    height: 14%;
    width: 98%;
    left: 1%;
    bottom: 1%;
}
#board {
    position: absolute;
    height: 100%;
    width: 100%;
}
#bandWrapper {
    position: absolute;
    top: 4%;
    width: 100%;
    height: 13%;
}
#band {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    height: 100%;
    width: auto;
}
#bandText {
    font-family: "Mont";
    position: absolute;
    text-align: center;
    line-height: 150%;
    width: 100%;
    font-size: 2vw;
    text-transform: capitalize;
}
#cardsWrapper {
    position: absolute;
    width: 100%;
    height: 65%;
    left: 5%;
    top: 19%;
}
#cards {
    height: 100%;
    overflow-y: auto;
    -ms-overflow-style: none;
    scrollbar-width: none;
}
#roomWrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    height: 100%;
    max-height: calc(60vw / 1.43058);
}
#svgSpacer {
    width: auto;
    height: 100%;
}
#rooms {
    /* background: #00ff0030; */
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
}
#rooms::-webkit-scrollbar {
    display: none;
}

@media (max-width: 999px) {
    #board {
        height: auto;
    }
}
</style>
