<template>
    <v-hover>
        <template v-slot:default="{ hover }">

            <div>
                <v-tooltip
                    bottom
                    :value="hover"
                >
                    <template v-slot:activator="{ hover, attrs }">
                        <PlayerCard
                            :name="name"
                            :level="level"
                            :team="team"
                            :avatar="avatar"
                            :pattern="pattern"
                            :cardPublicId="cardPublicId"
                            @rightClick="$emit('rightClick')"
                            noedit
                            v-bind="attrs"
                        />
                    </template>
                    <span>{{getHistoryText}}</span>
                </v-tooltip>
                <div
                    v-if="text !== undefined"
                    :class="[bubbletop ? 'Bbubble' : 'Tbubble']"
                >
                    <div
                        id="bubbletext"
                        :style="{ fontStyle: text ? 'normal' : 'italic', color: text ? (mentalistsay ? '#2f4d85': 'black') : 'grey', fontWeight: mentalistsay ? 'bold': 'normal'}"
                    >
                        {{ text || 'pass' }}
                    </div>
                </div>
                <v-fade-transition>
                    <v-overlay
                        v-if="hover && voting && !eliminated && alive"
                        absolute
                        color="#C62828"
                    >
                        <v-btn
                            rounded
                            @click="$emit('vote', cardPublicId)"
                        >Eliminate</v-btn>
                    </v-overlay>
                </v-fade-transition>
                <v-overlay
                    v-if="eliminated"
                    absolute
                    color="#C62828"
                />
                <img
                    v-if="eliminated"
                    id="eliminated"
                    src="@/games/mentalist/assets/dead.svg"
                />
            </div>

        </template>
    </v-hover>
</template>

<script>
import PlayerCard from '@/main/components/room/PlayerCard'
import { mapGetters } from 'vuex'
export default {
    components: {
        PlayerCard
    },
    props: {
        voting: {
            type: Boolean,
            default: false
        },
        team: {
            type: Number,
            default: 2
        },
        name: {
            type: String
        },
        level: {
            type: Number
        },
        cardPublicId: {
            type: String
        },
        avatar: {
            type: Number,
            default: 0
        },
        pattern: {
            type: Number,
            default: 1000
        },
        bubbletop: {
            type: Boolean,
            default: false
        },
        text: {
            type: String,
            default: undefined
        },
        bubbleshow: {
            type: Boolean,
            default: false
        },
        eliminated: {
            type: Boolean,
            default: false
        },
        alive: {
            type: Boolean,
            required: true
        },
        mentalistsay: {
            type: Boolean,
            required: false
        },
        infos: {
            required: false
        }
    },
    data () {
        const colorsLight = ['#3498db', '#e74c3c', '#2ecc71', '#9b59b6', '#1abc9c', '#34495e', '#f1c40f', '#e67e22']
        const colorsDark = ['#2980b9', '#c0392b', '#27ae60', '#8e44ad', '#16a085', '#2c3e50', '#f39c12', '#d35400']
        return {
            chosenLight: colorsLight[this.team],
            chosenDark: colorsDark[this.team]
        }
    },
    computed: {
        ...mapGetters(['publicId', 'masterId']),
        isMe () {
            return this.cardPublicId === this.publicId
        },
        isMaster () {
            return this.cardPublicId === this.masterId
        },
        cardColor () {
            return this.isMe ? '#ffffff' : '#020202'
        },
        getHistoryText () {
            if (this.infos && this.infos.history && this.infos.history.length !== 0) {
                return this.infos.history.join(' , ')
            }
            return '*no words*'
        }
    }
}
</script>

<style scoped>
#eliminated {
    position: absolute;
    z-index: 31;
}
#bubbletext {
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.Tbubble {
    position: absolute;
    top: 105%;
    left: 50%;
    transform: translateX(-50%);
    max-width: 100%;
    background-color: #fff;
    padding: 0.5em 1em;
    color: black;
    border-radius: 1rem;
    box-shadow: 0 0.125rem 0.5rem rgba(0, 0, 0, 0.3),
        0 0.0625rem 0.125rem rgba(0, 0, 0, 0.2);
    z-index: 32;
}
.Tbubble::before {
    content: "";
    position: absolute;
    width: 0;
    height: 0;
    bottom: 96%;
    left: 50%;
    transform: translateX(-50%);
    border: 0.75rem solid transparent;
    border-top: none;
    border-bottom-color: #fff;
    filter: drop-shadow(0 -0.0625rem 0.0625rem rgba(0, 0, 0, 0.1));
    z-index: 32;
}
.Bbubble {
    position: absolute;
    bottom: 105%;
    left: 50%;
    transform: translateX(-50%);
    max-width: 100%;
    background-color: #fff;
    padding: 0.5em 1em;
    color: black;
    border-radius: 1rem;
    box-shadow: 0 0.125rem 0.5rem rgba(0, 0, 0, 0.3),
        0 0.0625rem 0.125rem rgba(0, 0, 0, 0.2);
    z-index: 32;
}
.Bbubble::before {
    content: "";
    position: absolute;
    width: 0;
    height: 0;
    top: 96%;
    left: 50%;
    transform: translateX(-50%);
    border: 0.75rem solid transparent;
    border-bottom: none;
    border-top-color: #fff;
    filter: drop-shadow(0 -0.0625rem 0.0625rem rgba(0, 0, 0, 0.1));
    z-index: 32;
}
</style>
