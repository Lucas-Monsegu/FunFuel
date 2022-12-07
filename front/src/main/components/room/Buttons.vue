<template>
    <v-row
        id="buttons"
        justify="center"
    >
        <v-col
            class="buttoncol"
            id="playcol"
        >
            <v-btn
                id="playbtn"
                rounded
                outlined
                color="#2ecc71"
                @click="play"
                :disabled="!isMaster"
            >
                <v-icon left>
                    mdi-play
                </v-icon>
                Play
            </v-btn>
        </v-col>
        <v-col
            class="buttoncol"
            id="shufflecol"
        >
            <v-btn
                id="shufflebtn"
                rounded
                outlined
                color="#3498db"
                @click="shuffle"
                :loading="shuffleLoading"
                :disabled="!isMaster"
            >
                <v-icon left>
                    mdi-shuffle-variant
                </v-icon>
                Shuffle
            </v-btn>
        </v-col>
    </v-row>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    data () {
        return {
            shuffleLoading: false
        }
    },
    methods: {
        play () {
            this.$store.dispatch('play')
        },
        shuffle () {
            this.shuffleLoading = true
            this.$store.dispatch('RandomizeTeams').then(_ => {
                this.shuffleLoading = false
            })
        }
    },
    computed: {
        ...mapGetters(['isMaster'])
    }
}
</script>

<style scoped>
#playbtn {
    float: right;
}
#shufflebtn {
    float: left;
}
.buttoncol {
    padding: 5px;
    float: left;
}
#buttons {
    margin: 0;
}
</style>
