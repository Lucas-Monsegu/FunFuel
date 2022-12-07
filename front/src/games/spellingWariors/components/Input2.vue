<template>
    <div>

        <div id="gradient" />
        <div id="topbar" />

        <div id="midText">
            <span style="position: absolute; right: 0; white-space: pre">
                <span
                    v-for="(element, index) in phrase"
                    :key="index"
                    :class="errors.includes(index) ? 'errorletter' : ''"
                >{{element}}</span>
            </span>
        </div>
        <div class="errorcounter">
            <span
                class="display-3 font-weight-light"
                style="color: #EF5350"
                v-text="errors.length"
            ></span>
            <span
                class="subheading font-weight-light mr-1"
                style="color: #EF5350"
            >ERRORS</span>
        </div>
        <div id="bottombar" />
        <div class="cardp">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                height="100"
                width="599"
                class='svgSpacer'
            />
            <PlayerCard
                class='card'
                :name="playersData[playerId].userData.username"
                :level="playersData[playerId].userData.level"
                :avatar="playersData[playerId].userData.avatar"
                :pattern="playersData[playerId].userData.pattern"
                :team="0"
                :cardPublicId="playerId"
                @rightClick="$emit('rightClick')"
                noedit
            />

        </div>
    </div>

</template>

<script>
import { mapGetters } from 'vuex'
import PlayerCard from '@/main/components/room/PlayerCard'
export default {
    components: {
        PlayerCard
    },
    props: {
        first: {
            type: Boolean,
            default: false
        },
        playerId: {
            type: String,
            default: ''
        }

    },
    data () {
        return {
            realWords: '',
            realPhrasePlaying: '',
            playerWords: '',
            phrase: '',
            lang: 'fr',
            currentGen: undefined,
            errors: []
        }
    },
    mounted () {
    },
    computed: {
        ...mapGetters(['players', 'playersData', 'publicId', 'ws', 'masterId']),
        isMaster () {
            return this.publicId === this.masterId
        }
    },
    methods: {
        setWordsAndStart (realWords, infos) {
            this.currentGen = this.gen()

            this.realWords = realWords
            this.playerWords = infos[this.playerId].typedWords
            this.nextWord('nextword')
            this.nextWord('nextword')
        },
        timeout (ms) {
            return new Promise(resolve => setTimeout(resolve, ms))
        },
        * gen () {
            let i = 0
            for (let wordIndex = 0; wordIndex < this.realWords.length; ++wordIndex) {
                let t
                do {
                    t = yield
                }
                while (t !== 'nextword')
                const realWord = this.realWords[wordIndex]
                const playerWord = this.playerWords[wordIndex]
                const playerlen = this.playerWords[wordIndex] === undefined ? 0 : this.playerWords[wordIndex].length
                for (let letter = 0; letter < Math.max(playerlen, realWord.length); ++letter) {
                    if (letter >= playerlen) {
                        this.phrase += ' '
                        this.errors.push(i)
                    } else {
                        this.phrase += playerWord[letter]
                        if (letter >= realWord.length || playerWord[letter] !== realWord[letter]) {
                            this.errors.push(i)
                        }
                    }

                    setTimeout(() => {
                        this.currentGen.next('nextletter')
                    }, 200)
                    let b
                    do {
                        b = yield
                    }
                    while (b !== 'nextletter')
                    i += 1
                }
                this.phrase += ' '
                i += 1
            }
            for (let q = this.realWords.length; q < this.playerWords.length; ++q) {
                for (let letter = 0; letter < this.playerWords[q].length; ++letter) {
                    this.phrase += this.playerWords[q][letter]
                    this.errors.push(i)
                    i += 1
                    setTimeout(() => {
                        this.currentGen.next('nextletter')
                    }, 200)
                    let b
                    do {
                        b = yield
                    } while (b !== 'nextletter')
                }
                this.phrase += ' '
                i += 1
            }
        },
        nextWord (str) {
            this.currentGen.next(str)
        }

    }
}
</script>

<style scoped>
.errorcounter {
    position: absolute;
    left: 61%;
    top: 12%;
}
.errorletter {
    background-color: #ef5350;
    border-radius: 5px;
}
.cardp {
    position: absolute;
    width: 35vmin;
    top: 15px;
    right: 1px;
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

#refText {
    position: absolute;
    top: calc(20% - 110px);
    width: 50%;
    left: 0%;
    text-align: right;
    overflow: hidden;
    text-overflow: hidden;
    white-space: nowrap;
    height: 60%;
    font-size: 30px;
}
#midText {
    position: absolute;
    top: 20%;
    width: 50%;
    left: 0%;
    text-align: right;
    overflow: hidden;
    text-overflow: hidden;
    white-space: nowrap;
    height: 60%;
    font-size: 30px;
}
#topbar {
    top: 0%;
    width: 100%;
    height: 5%;
    color: white;
    background-color: white;
}
#bottombar {
    position: absolute;
    width: 100%;
    height: 5%;
    color: white;
    background-color: white;
    top: 100%;
}
#gradient {
    position: absolute;
    width: 200px;
    height: 90%;
    top: 5%;
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
</style>
