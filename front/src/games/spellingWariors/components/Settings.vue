<template>
    <div id="settings">
        <v-row>
            <v-col class="pa-2">
                <v-slider
                    v-model="speed"
                    thumb-label="always"
                    :thumb-size="24"
                    label="Time between words"
                    min=0
                    max=10
                    color="#3498DB"
                    hide-details
                    @change="sendOptions"
                    :readonly="!isMaster"
                ></v-slider>
            </v-col>
        </v-row>
        <v-row>
            <v-col class="pa-2">
                <v-slider
                    v-model="numberWords"
                    thumb-label="always"
                    :thumb-size="24"
                    label="Number of words"
                    min=10
                    max=80
                    color="#3498DB"
                    hide-details
                    @change="sendOptions"
                    :readonly="!isMaster"
                ></v-slider>
            </v-col>
        </v-row>
        <v-row>
            <v-col class="pt-0 pb-6">
                <v-select
                    label="Language"
                    :items="languages"
                    v-model="chosenLanguage"
                    hide-details
                    max-height="auto"
                    autocomplete
                    @change="sendOptions"
                    :readonly="!isMaster"
                >
                    <template
                        slot="selection"
                        slot-scope="data"
                    >

                        <img
                            class="flagselect"
                            :src="getFlag(data.item)"
                        />
                        <span class='pl-2 text-capitalize'>
                            {{data.item}}
                        </span>
                    </template>
                    <template
                        slot="item"
                        slot-scope="data"
                    >
                        <img
                            class="flag"
                            :src="getFlag(data.item)"
                        />
                        <span class='pl-2 text-capitalize'>
                            {{ data.item }}
                        </span>
                    </template>
                </v-select>
            </v-col>
            <v-col />
        </v-row>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    data () {
        return {
            speed: 5,
            chosenLanguage: 'english',
            numberWords: 40,
            languages: [
                'french',
                'english'
            ]
        }
    },
    mounted () {
        window.speechSynthesis.getVoices()
    },
    methods: {
        getFlag (item) {
            return require(`@/games/mentalist/assets/${item}.svg`)
        },
        sendOptions () {
            this.ws.send(JSON.stringify({
                command: 'SetOptions',
                lang: this.chosenLanguage,
                speed: this.speed,
                numberWords: this.numberWords
            }))
        },
        setOptions (options) {
            this.chosenLanguage = options.lang
            this.speed = options.speed
            this.numberWords = options.numberWords
        }
    },
    computed: {
        ...mapGetters(['ws', 'isMaster'])
    }

}
</script>

<style scoped>
.flag {
    width: 20%;
}
.flagselect {
    width: 25%;
}
#settings {
    padding-top: 15px;
}
</style>
