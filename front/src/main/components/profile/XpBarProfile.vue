<template>
    <div>
        <v-row no-gutters>
            <div style='text-align: center; width: 100%; font-family: Mont;'>xp: {{currentXp}}/{{maxXp}}</div>
        </v-row>
        <v-row no-gutters>
            <v-col
                cols=1
                style="text-align: right"
                class='mr-2'
            >
                <div style="font-family: 'Mont'">
                    {{this.currentLevel}}
                </div>
            </v-col>
            <v-col>
                <div class="centerY">
                    <v-progress-linear
                        :value="xpPercentage"
                        height="15"
                        color='#FFDA00'
                        background-opacity='0.25'
                        rounded
                        bottom
                    ></v-progress-linear>
                </div>
            </v-col>
            <v-col
                cols=1
                class='ml-2'
            >
                <div style="font-family: 'Mont'">
                    {{this.currentLevel+1}}
                </div>
            </v-col>

        </v-row>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    props: {
    },
    data () {
        return {
            loggedIn: true,
            currentXp: 0,
            currentLevel: 0,
            maxXp: 0,
            xpPercentage: 0,
            animSec: 2,
            isStream: false,
            timeInGameBonus: 0,
            firstVictoryBonus: 0,
            WinBonus: 0,
            total: 0,
            gen: () => { },
            getDataPromise: () => { }
        }
    },
    mounted () {
        this.setXp()
    },
    computed: {
        isMe () {
            return this.userPublicId === this.id
        },
        ...mapGetters(['userPublicId', 'xp', 'level'])
    },
    methods: {

        getStyleAnim () {
            return {
                transitionDuration: `${this.animSec}s  !important`
            }
        },
        calculateMaxXp (lvl) {
            if (lvl < 10) {
                return ((lvl * (lvl + 1)) / 2) * 100
            }
            return 1000
        },
        setXp () {
            this.currentLevel = this.level
            this.currentXp = this.xp
            this.maxXp = this.calculateMaxXp(this.currentLevel)
            this.xpPercentage = this.xpPercentage = (this.currentXp / this.calculateMaxXp(this.currentLevel)) * 100
        },
        notLogged () {
            this.loggedIn = false
            this.xpUp(0, 0, 99, 0, 0, 0, 0, 0)
        }

    }
}
</script>

<style scoped>
.centerY {
    position: relative;
    top: 50%;
    transform: translateY(-50%);
}
.rela {
    position: relative;
}
.top {
    position: relative;
    top: 0;
}
.my-progress-linear .v-progress-linear__determinate {
    transition: none !important;
}
</style>
