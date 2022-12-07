<template>
    <div
        id="card"
        @contextmenu="rightClick"
    >
        <svg
            id="back"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 258.86 43.17"
        >
            <g data-name="Layer 2">
                <g>
                    <path
                        d="M2.5,2.5H256.36V40.67H2.5Z"
                        :style="`fill:${chosenLight}`"
                    />
                </g>
            </g>
        </svg>
        <img
            id="pattern"
            :src="`https://funfuelbucket.s3.amazonaws.com/pattern/${pattern}.svg`"
        >
        <svg
            id="border"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 258.86 43.17"
        >
            <g data-name="Layer 2">
                <g data-name="Layer 1">
                    <path
                        d="M1,1H257.86V42.17H1Z"
                        :style="`fill:none;stroke:${cardColor};stroke-miterlimit:10;stroke-width:2px`"
                    />
                </g>
            </g>
        </svg>
        <div
            id="avatar"
            :style="`background-image: url('https://funfuelbucket.s3.amazonaws.com/avatar/${avatar}.svg');`"
        />
        <div id="outname">
            <!-- <div id="name">
                {{ name }}
            </div> -->

            <div id="nameInput">
                <div
                    v-if="noedit || !isMe"
                    class="mt-0 pt-0"
                >
                    {{ name }}
                </div>
                <v-text-field
                    v-else
                    hide-details
                    background-color="transparent"
                    solo
                    flat
                    dense
                    maxlength="20"
                    @blur="changeName"
                    @focus="focus"
                    @keypress.enter="enter"
                    ref="input"
                    :value="name"
                >
                </v-text-field>
            </div>
        </div>
        <level
            id='lvl'
            :level="level"
        >
        </level>
        <img
            src="@/main/assets/room/master_crown.svg"
            id="crown"
            v-if="isMaster"
        />
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import level from '../profile/Level.vue'
export default {
    components: { level },
    props: {
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
        noedit: {
            type: Boolean,
            default: false
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
        }
    },
    methods: {
        rightClick (e) {
            e.preventDefault()
            this.$emit('rightClick', e)
        },
        focus (e) {
            if (this.isMe) { e.target.select() }
        },
        enter () {
            this.$refs.input.blur()
        },
        changeName (e) {
            const newname = e.target.value.trim()
            if (this.isMe && newname.length && newname !== this.name) {
                this.$store.getters.ws.send(JSON.stringify({ command: 'ChangePlayerName', username: newname }))
            } else {
                e.target.value = this.name
            }
        }
    }
}

</script>

<style scoped>
#crown {
    position: absolute;
    width: 9%;
    top: -16%;
    left: -2%;
    transform: rotate(-45deg);
    z-index: 30;
}
#lvl {
    position: absolute;
    height: 75%;
    width: 12.518%;
    top: 12.5%;
    right: 2.5%;
}
#pattern {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
}
#card {
    display: inline-block;
    cursor: pointer;
    transition: box-shadow;
}
#card,
#back,
#border,
#outname,
#avatar {
    position: absolute;
}
#card,
#outname,
#back,
#border {
    width: 100%;
    height: 100%;
}
#avatar {
    height: 75%;
    width: 12.519%;
    border-radius: 50%;
    left: 2.5%;
    top: 12.5%;
    background-position: center center;
    background-size: cover;
}
#outname {
    display: table;
    left: 18%;
    height: 100%;
    width: 64%;
    text-align: center;
}
#name {
    position: static;
    display: table-cell;
    vertical-align: middle;
    font-family: "Mont";
}
#nameInput {
    top: 50%;
    left: 50%;
    width: 100%;
    transform: translate(-50%, -50%);
    font-family: "Mont";
    position: absolute;
}
</style>
