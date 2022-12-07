<template>
    <div id="rules">
        <v-bottom-sheet inset>
            <template v-slot:activator="{ on }">
                <img
                    src="@/main/assets/roomlist/rules.svg"
                    ondragstart="return false;"
                    v-on="on"
                />
            </template>
            <v-sheet
                class="text-center"
                height="70vh"
            >
                <div style="font-family: Mont; font-size: 30px">
                    Rules of {{gameTitle}}:
                </div>
                <div class="my-4">
                    <component
                        v-if="rulesComponent"
                        :is="rulesComponent"
                    />
                </div>
            </v-sheet>
        </v-bottom-sheet>
    </div>
</template>

<script>
export default {
    props: {
        gameTitle: {
            type: String,
            required: true
        }
    },
    data () {
        return {
            rulesComponent: () => import('@/games/' + this.$route.params.game + '/components/Rules.vue')
        }
    },
    mounted () {
    },
    computed: {
        rulesText () {
            return this.rules[this.gameTitle.toLowerCase()]
        }
    }
}
</script>

<style scoped>
#rules {
    cursor: pointer;
    display: inline-block;
    width: fit-content;
    height: fit-content;
}
</style>
