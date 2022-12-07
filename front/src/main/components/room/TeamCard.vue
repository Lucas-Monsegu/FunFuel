<template>
    <div :style="cardStyle">
        <v-menu
            v-model="rightClickMenu"
            :position-x="rightClickX"
            :position-y="rightClickY"
            absolute
            offset-y
        >
            <v-list dense>
                <v-list-item @click="kick">
                    <v-list-item-title>Kick</v-list-item-title>
                    <v-list-item-icon>
                        <v-icon>mdi-karate</v-icon>
                    </v-list-item-icon>
                </v-list-item>
            </v-list>
        </v-menu>

        <div :style="headerStyle">
            <span id="nameText">
                {{ name }}
            </span>
            <div id="nameInput">
                <v-text-field
                    class="mt-0 pt-0"
                    hide-details
                    background-color="transparent"
                    solo
                    flat
                    dense
                    @blur="changeName"
                    :readonly="!hideJoin"
                    @focus="focus"
                    @keypress.enter="enter"
                    ref="input"
                    :value="name"
                >
                </v-text-field>
            </div>
        </div>
        <div id="playerCards">
            <draggable
                v-model="status"
                group="team"
                @end="end"
                :id="team"
                :disabled="!isMaster"
                class="drag"
                :animation="150"
            >
                <div
                    class="cardWrapper"
                    v-for="player in players[team]"
                    :key="playersData[player].id"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="100"
                        width="599"
                        class='svgSpacer'
                    />
                    <playercard
                        class="card"
                        :name="playersData[player].userData.username"
                        :level="playersData[player].userData.level"
                        :team="team"
                        :avatar="playersData[player].userData.avatar"
                        :pattern="playersData[player].userData.pattern"
                        :cardPublicId="playersData[player].id"
                        @rightClick="rightClick($event, playersData[player].id)"
                    />
                </div>
            </draggable>

        </div>
        <div
            id="join"
            :style="joinStyle"
            :class="{ hidden: hideJoin }"
            @click="join"
        >
            JOIN
        </div>
    </div>
</template>

<script>
import playercard from './PlayerCard.vue'
import draggable from 'vuedraggable'
import { mapGetters } from 'vuex'

export default {
    components: { playercard, draggable },
    props: {
        name: {
            type: String,
            required: true
        },
        team: {
            type: Number,
            required: true
        }
    },
    data () {
        const light = ['#3498db', '#e74c3c', '#2ecc71', '#9b59b6', '#1abc9c', '#34495e', '#f1c40f', '#e67e22'][this.team]
        const dark = ['#2980b9', '#c0392b', '#27ae60', '#8e44ad', '#16a085', '#2c3e50', '#f39c12', '#d35400'][this.team]
        return {
            cardStyle: {
                background: `${dark}20`,
                border: `solid 5px ${dark}`,
                width: '100%',
                height: '100%',
                position: 'relative'
            },
            headerStyle: {
                background: light,
                width: '100%',
                height: '50px',
                position: 'relative',
                'border-bottom': `solid 5px ${dark}`,
                'text-align': 'center',
                'line-height': '45px',
                'font-family': 'Mont'
            },
            joinStyle: {
                'border-bottom': `30px solid ${dark}`,
                'user-select': 'none'
            },
            rightClickX: 0,
            rightClickY: 0,
            rightClickMenu: false,
            rightClickId: null
        }
    },
    methods: {
        rightClick (e, playerId) {
            this.rightClickMenu = false
            if (this.isMaster) {
                this.rightClickId = playerId
                this.rightClickX = e.clientX
                this.rightClickY = e.clientY
                this.$nextTick(() => {
                    this.rightClickMenu = true
                })
            }
        },
        kick () {
            if (this.rightClickId != null) {
                this.$store.dispatch('kick', this.rightClickId)
            }
        },
        focus (e) {
            if (this.hideJoin) { e.target.select() }
        },
        enter () {
            this.$refs.input.blur()
        },
        changeName (e) {
            const newname = e.target.value.trim()
            if (this.hideJoin && newname.length && newname !== this.name) {
                this.$store.getters.ws.send(JSON.stringify({ command: 'ChangeTeamName', teamName: newname }))
            } else {
                e.target.value = this.name
            }
        },
        join () {
            this.$store.dispatch('wsJoinTeam', this.team)
        },
        end ({ to, newIndex }) {
            const newTeam = parseInt(to.id)
            this.$store.dispatch('ChangePlayerTeamAdmin', {
                playerId: this.players[newTeam][newIndex],
                newPosition: newIndex,
                newTeam
            })
        }
    },
    computed: {
        status: {
            get () {
                return this.$store.getters.players[this.team]
            },
            set: function (value) {
                this.$store.commit('setTeam', { team: value, index: this.team })
            }
        },
        ...mapGetters(['publicId', 'players', 'isMaster', 'playersData']),
        hideJoin () {
            return this.players[this.team].includes(this.publicId)
        }

    }
}
</script>

<style>
#nameInput input {
    text-align: center;
}
</style>

<style scoped>
.drag {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
}
.hidden {
    display: none;
}
#join {
    cursor: pointer;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 0;
    height: 0;
    line-height: 30px;
    text-align: center;
    width: 100px;
    border-left: 25px solid transparent;
    border-right: 25px solid transparent;
    font-family: "Mont";
    box-sizing: content-box;
    box-shadow: inset;
}
#nameText {
    position: absolute;
    display: none;
}
#nameInput {
    top: 50%;
    left: 50%;
    width: 80%;
    transform: translate(-50%, -50%);
    position: absolute;
}
.cardWrapper {
    position: relative;
    left: 5%;
    margin-top: 3%;
    margin-bottom: 3%;
    width: 90%;
}
.svgSpacer {
    position: relative;
    width: 100%;
    height: auto;
    display: block;
}
.card {
    /* background: #00ff0030; */
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
}
#playerCards {
    position: absolute;
    bottom: 0;
    top: 50px;
    width: 100%;
    overflow-y: scroll;
    -ms-overflow-style: none;
    scrollbar-width: none;
}
#playerCards::-webkit-scrollbar {
    display: none;
}
.playerCard {
    width: 100%;
    padding-bottom: 16%;
    position: relative;
}
</style>
