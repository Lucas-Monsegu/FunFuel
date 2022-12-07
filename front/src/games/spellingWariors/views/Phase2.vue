<template>
    <v-container fluid>
        <div id="main">
            <div id="refText">
                <div id="gradient" />

                <span style="position: absolute; right: 0; white-space: pre">
                    <span>{{realPhrasePlaying}}</span>
                </span>
            </div>
            <div id="sentences">
                <div
                    v-for="(player, index) in players[0]"
                    :key="index"
                    class="mdr"
                >

                    <Input2
                        id="mid"
                        ref="inp"
                        :playerId="player"
                        @Finish="finish()"
                        :style="getStyleInput(index)"
                        :first="index===0"
                    >

                    </Input2>

                </div>
            </div>
        </div>
    </v-container>
</template>

<script>
import Input2 from '@/games/spellingWariors/components/Input2'

import { mapGetters } from 'vuex'
export default {
    props: {
        words: {
            type: Array
        },
        infos: {
            type: Object
        }
    },
    components: {
        Input2
    },
    data () {
        return {
            realPhrasePlaying: '',
            gen: undefined
        }
    },
    mounted () {
        if (this.isMaster) {
            window.addEventListener('keydown', this.listener)
        }
        this.SetWordsAndStartAll(this.words, this.infos)
    },
    destroyed () {
        window.removeEventListener('keydown', this.listener)
    },
    methods: {
        test (w) {
        },
        * correction () {
            for (let i = 0; i < this.words.length; ++i) {
                const word = this.words[i]
                let t
                do {
                    t = yield
                } while (t !== 'nextword')
                for (let letter = 0; letter < word.length; ++letter) {
                    setTimeout(_ => { this.gen.next('wait') }, 200)
                    let d
                    do {
                        d = yield
                    } while (d !== 'wait')
                    this.realPhrasePlaying += word[letter]
                }
                this.realPhrasePlaying += ' '
            }
        },
        listener (e) {
            if (e.key === ' ') {
                this.ws.send(JSON.stringify({ command: 'Next' }))
                if (this.isMaster) {
                    this.nextWord('nextword')
                }
            }
        },
        nextWord () {
            this.$refs.inp.forEach(el => el.nextWord('nextword'))
            if (this.gen !== undefined) {
                this.gen.next('nextword')
            }
        },
        SetWordsAndStartAll (realWords, infos) {
            this.gen = this.correction()
            this.gen.next('nextword')
            this.gen.next('nextword')
            for (let i = 0; i < this.$refs.inp.length; ++i) {
                this.$refs.inp[i].setWordsAndStart(realWords, infos)
            }
        },
        getStyleInput (index) {
            return {
                position: 'relative',
                width: '100%',
                height: '80px',
                top: '0px'
            }
        },
        getStyleCard (index) {
            return {
                position: 'absolute',
                width: '35vmin',
                top: '0px',
                right: '1%'
            }
        }
    },
    computed: {
        ...mapGetters(['players', 'playersData', 'publicId', 'ws', 'masterId']),
        isMaster () {
            return this.publicId === this.masterId
        }
    }

}
</script>

<style scoped>
#sentences {
    position: relative;
    width: 100%;
    padding-top: 30vmin;
}

#refText {
    position: absolute;
    top: 20vmin;
    width: 50%;
    left: 0%;
    text-align: right;
    overflow: hidden;
    text-overflow: hidden;
    white-space: nowrap;
    height: 60px;
    font-size: 30px;
}
#gradient {
    position: absolute;
    width: 200px;
    height: 100px;
    top: 15%;
    z-index: 2;
    background: #484e59;
    background: #484e59;
    background: linear-gradient(
        90deg,
        #484e59 0%,
        #484e59 25%,
        rgba(110, 117, 125, 0) 100%
    );
}
.cardWrapper {
    position: absolute;
    width: 35vmin;
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

.test {
    position: absolute;
    z-index: 3;
    width: 200px;
    top: 50%;
    left: 50%;
    height: 100px;
}
</style>
