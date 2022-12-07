<template>
    <v-card>
        <v-toolbar
            flat
            color="#3498db"
            dark
        >
            <v-toolbar-title id="title">
                Statistics
            </v-toolbar-title>
            <img
                id="piechart"
                src="@/main/assets/profile/stats/piechart.svg"
            />
        </v-toolbar>
        <v-list
            three-line
            class="pa-0"
        >
            <template v-for="(item, index) in items">
                <v-subheader
                    v-if="item.header"
                    :key="item.header"
                    v-text="item.header"
                ></v-subheader>
                <v-divider
                    v-else-if="item.divider"
                    :key="index"
                    :inset="item.inset"
                ></v-divider>
                <v-list-item
                    v-else
                    :key="item.title"
                >
                    <v-list-item-avatar>
                        <img :src="item.avatar" />
                    </v-list-item-avatar>

                    <v-list-item-content>
                        <v-list-item-title
                            class="headline ma-0 text-capitalize"
                            v-html="item.title"
                        />
                        <div class="stat">
                            <div class="numbergames text-center py-3">
                                <v-progress-linear
                                    :value="item.wins / item.games * 100"
                                    height="20"
                                    :color="item.theme"
                                >
                                    {{ `${item.wins} wins / ${item.games} games` }}
                                </v-progress-linear>
                            </div>
                            <div class="time">
                                <img
                                    class="clock"
                                    src="@/main/assets/profile/stats/time.svg"
                                />
                                <div class="timetext">
                                    {{ timetext(item.timePlayed) }}
                                </div>
                            </div>
                        </div>
                    </v-list-item-content>
                </v-list-item>
            </template>
        </v-list>
    </v-card>
</template>

<script>
import axios from 'axios'

export default {
    data () {
        return {
            publicId: this.$route.params.id,
            gameInfos: {
                mentalist: {
                    theme: '#B54A56'
                },
                blindTest: {
                    theme: 'teal'
                }
            },
            items: []
        }
    },
    mounted () {
        axios.get(`${process.env.VUE_APP_MAINURL}/stats/user?publicId=${this.publicId}`).then(res => {
            const data = res.data
            this.items = []
            for (const game of Object.keys(data)) {
                if (game === 'user_id' || this.gameInfos[game] === undefined || data[game] === null) {
                    continue
                }
                this.items.push({
                    title: game,
                    theme: this.gameInfos[game].theme,
                    avatar: require(`@/${this.$store.getters.getImage(game)}.svg`),
                    games: data[game][0],
                    wins: data[game][1],
                    timePlayed: data[game][2]
                })
            }
        })
    },
    methods: {
        timetext (sec) {
            const minutes = Math.floor((sec / 60) % 60)
            const hours = Math.floor(sec / 3600)
            const minutestext = `${minutes} minute${minutes > 1 ? 's' : ''}`
            const hourstext = `${hours} hour${hours > 1 ? 's' : ''}`
            return hours ? `${hourstext} and ${minutestext}` : minutestext
        }
    }
}
</script>

<style scoped>
.clock {
    height: 40px;
}
.time {
    display: flex;
    align-items: center;
}
.timetext {
    padding-left: 8px;
}
#piechart {
    height: 90%;
    padding-left: 10px;
}
#title {
    font-family: "Mont";
}
</style>
