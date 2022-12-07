<template>
    <div id="settings">
        <v-row>
            <v-col class="pa-0">
                <v-slider
                    v-model="secondsPerTurn"
                    thumb-label="always"
                    :thumb-size="24"
                    label="sec/turn"
                    min=10
                    max=99
                    color="#3498DB"
                    hide-details
                    @change="sendOptions"
                    :readonly="!isMaster"
                ></v-slider>
            </v-col>
            <v-col class="pa-0">
                <v-slider
                    v-model="secondsPerVote"
                    thumb-label="always"
                    :thumb-size="24"
                    label="sec/vote"
                    min=10
                    max=99
                    color="#3498DB"
                    hide-details
                    @change="sendOptions"
                    :readonly="!isMaster"
                ></v-slider>
            </v-col>
        </v-row>
        <v-row>
            <v-col class="pt-0 pb-6">
                <v-switch
                    v-model="defaultvalues"
                    label="Default"
                    hide-details
                    @change="sendOptions"
                    :readonly="!isMaster"
                ></v-switch>
            </v-col>
            <v-col class="pt-0 pb-6">
                <v-select
                    label="words"
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
        </v-row>
        <v-row>
            <v-col class="pa-0">
                <v-slider
                    v-model="doubleAgents"
                    thumb-label="always"
                    :thumb-size="24"
                    min=0
                    max=16
                    color="#b54a56"
                    hide-details
                    dense
                    :disabled="defaultvalues"
                    @change="sendOptions"
                    :readonly="!isMaster"
                ></v-slider>
                <div style="text-align: center">
                    Double-agents
                </div>
            </v-col>
            <v-col class="pa-0">
                <v-slider
                    v-model="mentalists"
                    thumb-label="always"
                    :thumb-size="24"
                    min=0
                    max=16
                    color="#2f4d85"
                    hide-details
                    dense
                    :disabled="defaultvalues"
                    @change="sendOptions"
                    :readonly="!isMaster"
                ></v-slider>
                <div style="text-align: center">
                    Mentalists
                </div>
            </v-col>
        </v-row>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    data () {
        return {
            secondsPerTurn: 20,
            secondsPerVote: 30,
            defaultvalues: true,
            doubleAgents: 0,
            mentalists: 0,
            chosenLanguage: 'english',
            languages: [
                'french',
                'english'
            ]
        }
    },
    methods: {
        getFlag (item) {
            return require(`@/games/mentalist/assets/${item}.svg`)
        },
        sendOptions () {
            const c = JSON.stringify({
                command: 'SetOptions',
                msPerTurn: this.secondsPerTurn * 1000,
                msPerVote: this.secondsPerVote * 1000,
                default: this.defaultvalues,
                doubleagents: this.doubleAgents,
                mentalists: this.mentalists,
                language: this.chosenLanguage
            })
            this.ws.send(c)
        },
        setOptions (options) {
            this.secondsPerTurn = options.msPerTurn / 1000
            this.secondsPerVote = options.msPerVote / 1000
            this.defaultvalues = options.default
            this.doubleAgents = options.doubleagents
            this.mentalists = options.mentalists
            this.chosenLanguage = options.language
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
