<template>
    <div class="text-center">
        <v-bottom-sheet
            v-model="opensheet"
            inset
        >

            <v-sheet
                class="text-center"
                height="70vh"
            >
                <div class="headline">Winners: </div>
                <div
                    class="my-3"
                    v-for="(str, index) in winnersTab"
                    :key="index"
                >{{str}}</div>
            </v-sheet>
        </v-bottom-sheet>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    props: {
        open: {
            type: Boolean,
            default: false
        },
        winners: {
            type: Array
        }
    },
    data () {
        return {
        }
    },
    computed: {
        ...mapGetters(['playersData']),
        winnersTab () {
            const winners = this.winners.map((el, index) => { return (index + 1).toString() + ' ' + this.playersData[el].userData.username })
            return winners
        },
        opensheet () {
            return this.open
        }
    }
}
</script>

<style scoped>
</style>
