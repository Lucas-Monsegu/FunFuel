<template>
    <div>
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
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                            <v-progress-linear
                                v-on="on"
                                :style="getStyleAnim()"
                                :value="xpPercentage"
                                :color="loggedIn ? '#FFDA00' : 'grey'"
                                :striped="loggedIn ? false: true"
                                height="15"
                                background-opacity="0.25"
                                rounded
                                buffer-value="0"
                                :stream="isStream"
                                bottom
                            ></v-progress-linear>
                        </template>
                        <div v-if="!loggedIn">
                            Log in to receive xp
                        </div>
                        <div v-else>
                            <span>{{`Points: ${this.currentXp}/${this.maxXp}`}}</span>
                            <span v-if="firstVictoryBonus !== 0"><br>{{`First victory of the day: ${firstVictoryBonus}`}}</span>
                            <span v-if="WinBonus !== 0"><br>{{`Game won: ${WinBonus}`}}</span>
                            <span v-if="timeInGameBonus !== 0"><br>{{`Time in game: ${timeInGameBonus}`}}</span>
                            <span v-if="total !== 0"><br>{{`Total: ${total}`}}</span>
                        </div>
                    </v-tooltip>
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
        this.maxXp = this.calculateMaxXp(this.currentLevel)
        this.xpPercentage = (this.currentXp / this.maxXp) * 100
    },
    computed: {
        ...mapGetters(['playersData', 'publicId'])
    },
    methods: {
        clickNextLevel () {
            this.gen.next()
        },
        * waiter (currentXp, newLevel, previousLevel) {
            let n = 0
            for (let level = previousLevel; level < newLevel; ++level) {
                setTimeout(() => { this.gen.next() }, 2000)
                this.xpPercentage = 100
                yield
                this.$emit('LevelUp', n)
                n += 1
                this.currentLevel = level + 1
                this.animSec = 0
                this.xpPercentage = 0
                this.maxXp = this.calculateMaxXp(this.currentLevel)
                yield
                this.animSec = 2
            }
            this.maxXp = this.calculateMaxXp(newLevel)
            this.xpPercentage = (currentXp / this.maxXp) * 100
            this.currentXp = currentXp
            setTimeout(() => { this.gen.next() }, 2000)
            yield
            this.animSec = 0.5
            this.isStream = false
            this.getDataPromise = this.$store.dispatch('getData')
        },
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
        notLogged () {
            this.loggedIn = false
            this.xpUp(0, 0, 99, 0, 0, 0, 0, 0)
        },
        async xpUp (previousXp, previousLevel, newXp, newLevel, firstVictoryBonus, winPoints, IngamePoints, total) {
            this.currentXp = previousXp
            this.currentLevel = previousLevel
            this.firstVictoryBonus = firstVictoryBonus
            this.WinBonus = winPoints
            this.timeInGameBonus = IngamePoints
            this.total = total
            const maxXp = this.calculateMaxXp(previousLevel)
            this.animSec = 0
            this.xpPercentage = (this.currentXp / maxXp) * 100

            this.$nextTick(() => {
                this.isStream = true
                setTimeout(() => {
                    this.animSec = 2

                    this.gen = this.waiter(newXp, newLevel, previousLevel)
                    this.gen.next()
                }, 500)
            })
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
