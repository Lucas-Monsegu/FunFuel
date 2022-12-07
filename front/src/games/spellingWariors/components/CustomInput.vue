<template>
    <div>

        <div id="gradient" />
        <div id="topbar" />
        <div id="midText">
            <span style="position: absolute; right: 0; white-space: pre">{{phrase}}</span>
        </div>
        <div id="cursor" />
        <div id="bottombar" />
        <div id="infos">
            <span>Words said: </span><span> {{numberWords}}</span>
            <span>Your words: </span><span :style="getStyleNumberWords()"> {{numberPlayerWords}}</span>
        </div>
    </div>

</template>

<script>
export default {
    props: {
        phase2: {
            type: Boolean,
            default: false
        },
        lang: {
            type: String
        }
    },
    data () {
        return {
            phrase: '',
            words: undefined,
            wordsWithPunctuation: undefined,
            synth: window.speechSynthesis,
            voice: new window.SpeechSynthesisUtterance(),
            currentSaying: undefined,
            eventListener: undefined,
            numberWords: 0,
            waitBetweenWords: 1,
            frenchPunc: {
                '.': ' poin',
                ',': ' virgul',
                '?': ' pointdinterrogation',
                ':': ' 2points',
                ';': ' point-virgule',
                '!': ' point-d\'exclamation'
            }
        }
    },
    mounted () {
        this.voice.rate = 0.7
        if (!this.phase2) {
            this.eventListener = window.addEventListener('keydown', this.listener)
            this.currentSaying = this.gen()
        }
    },
    destroyed () {
        window.removeEventListener('keydown', this.listener)
        this.currentSaying = undefined
    },
    computed: {
        numberPlayerWords () {
            return this.phrase.split(' ').length
        }
    },
    methods: {
        getStyleNumberWords () {
            return {
                color: this.numberPlayerWords !== this.numberWords ? 'red' : 'green'
            }
        },
        addWord (word) {
            this.phrase += word
        },
        listener (e) {
            if (e.key === 'Backspace') {
                e.preventDefault()
                this.phrase = this.phrase.slice(0, -1)
            }
            if (e.key === '\'') {
                e.preventDefault()
            }
            if (e.key.length !== 1) {
                return
            }
            this.phrase += e.key
        },
        setWords (words) {
            if (this.words === undefined) {
                if (this.lang === 'french') {
                    this.wordsWithPunctuation = words.join(' ').replace(/[.,?:;!]/g, (match) => { return this.frenchPunc[match] }).split(' ')
                }
                this.words = words
                this.currentSaying.next()
            }
        },
        setSpeed (speed) {
            this.waitBetweenWords = speed * 500
        },
        timeout (ms) {
            return new Promise(resolve => setTimeout(resolve, ms))
        },
        getLang () {
            return this.synth.getVoices().filter(el => el.lang.includes(this.lang.substring(0, 2)))[0]
        },
        isPunctation (word) {
            if (this.lang === 'french') {
                return Object.values(this.frenchPunc).indexOf(' ' + word) >= 0
            } else {
                return false
            }
        },
        changeVolume (vol) {
            this.voice.volume = vol / 100
        },

        * gen () {
            this.voice.voice = this.getLang()
            for (const word of this.wordsWithPunctuation) {
                if (!this.isPunctation(word)) {
                    this.numberWords += 1
                }
                this.voice.text = word
                this.synth.speak(this.voice)
                this.voice.onend = _ => {
                    setTimeout(_ => {
                        return this.currentSaying?.next()
                    }, this.waitBetweenWords)
                }

                yield
            }
            setTimeout(_ => {
                window.removeEventListener('keydown', this.listener)
                this.$emit('Finish', this.phrase)
            }, 5000)
        }
    }
}
</script>

<style scoped>
#cursor {
    position: absolute;
    left: 70.2%;
    top: 22.5%;
    background-color: white;
    height: 60%;
    width: 3px;
    animation: blink 0.8s infinite;
}
#infos {
    position: absolute;
    top: calc(100% + 30px);
    left: 10%;
}
#midText {
    position: absolute;
    top: 20%;
    width: 70%;
    left: 0%;
    text-align: right;
    overflow: hidden;
    text-overflow: hidden;
    white-space: nowrap;
    height: 60px;
    font-size: 40px;
}
#topbar {
    top: 0%;
    width: 100%;
    height: 5px;
    color: white;
    background-color: white;
}
#bottombar {
    position: absolute;
    width: 100%;
    height: 5px;
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

@keyframes blink {
    0% {
        background: white;
    }
    50% {
        background: transparent;
    }
    100% {
        background: white;
    }
}
</style>
