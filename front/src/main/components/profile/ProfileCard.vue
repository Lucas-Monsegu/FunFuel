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
            v-if="pattern"
            :src="getPattern"
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
                        :style="`fill:none;stroke:#fff;stroke-miterlimit:10;stroke-width:2px`"
                    />
                </g>
            </g>
        </svg>
        <div
            id="avatar"
            v-if="avatar"
            :style="`background-image: url('https://funfuelbucket.s3.amazonaws.com/avatar/${avatar}.svg');`"
        />
        <div id="outname">
            <!-- <div id="name">
                {{ name }}
            </div> -->

            <div id="nameInput">
                <div
                    v-if="!isMe"
                    class="mt-0 pt-0 font"
                >
                    {{ name }}
                </div>
                <div v-else>
                    <v-text-field
                        class="font"
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
                        @input="sync = false"
                    >
                    </v-text-field>
                    <v-row justify="center">
                        <v-checkbox
                            v-model="sync"
                            hide-details
                            class="mx-2 mt-0"
                            color='white'
                            id="sync"
                            label="Sync name with account"
                        ></v-checkbox>
                    </v-row>
                </div>
            </div>
        </div>
        <level
            id='lvl'
            :level="level"
            class="font"
        >
        </level>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import level from './Level.vue'
export default {
    components: { level },
    props: {
        isMe: {
            type: Boolean,
            default: false
        },
        name: {
            type: String,
            default: 'Default'
        },
        level: {
            type: Number,
            default: 0
        },
        avatar: {
            type: Number,
            default: 0
        },
        pattern: {
            type: Number,
            default: 0
        }
    },
    data () {
        const colorsLight = ['#3498db', '#e74c3c', '#2ecc71', '#9b59b6', '#1abc9c', '#34495e', '#f1c40f', '#e67e22']
        const colorsDark = ['#2980b9', '#c0392b', '#27ae60', '#8e44ad', '#16a085', '#2c3e50', '#f39c12', '#d35400']
        return {
            chosenLight: colorsLight[0],
            chosenDark: colorsDark[0]
        }
    },
    mounted () {
    },
    computed: {
        ...mapGetters(['publicId', 'masterId']),
        getPattern () {
            return `https://funfuelbucket.s3.amazonaws.com/pattern/${this.pattern}.svg`
        },
        sync: {
            get () {
                return this.$store.getters.syncName
            },
            set (value) {
                this.$emit('setSync', value)
            }
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
                this.$emit('setName', newname)
            } else {
                e.target.value = this.name
            }
        }
    }
}

</script>

<style>
.v-label {
    color: white !important;
}
#synccheck {
    position: absolute;
    top: 100px;
}
</style>

<style scoped>
#sync {
    text-align: center;
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
    position: relative;
    display: inline-block;
    transition: box-shadow;
    width: 40vw;
    height: calc(40vw / 5.911);
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}
#back,
#border,
#outname,
#avatar {
    position: absolute;
}
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
.font {
    font-size: 1.7em !important;
}
</style>
