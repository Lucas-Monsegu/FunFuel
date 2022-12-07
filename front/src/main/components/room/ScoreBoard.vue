<template>
    <div id='bg'>
        <div id='innergamecomp'>
            <v-row
                no-gutters
                class='pt-5'
            >
                <div id='title'>
                    {{gameName}}
                </div>
            </v-row>
            <v-row no-gutters>
                <div
                    class='txtcenter'
                    :style="getStyleLevelUp()"
                >
                    Level Up !
                </div>
            </v-row>
            <v-row
                no-gutters
                class='pb-10'
            >
                <v-spacer />
                <v-col cols=8>

                    <XpBar
                        ref="xpBar"
                        @LevelUp="levelup"
                    />
                </v-col>

                <v-spacer />

            </v-row>
            <div id='scoreboardanim' />
            <div id='tableContainer'>
                <v-data-table
                    :headers="headers"
                    :items="values"
                    disable-sort
                    disable-filtering
                    hide-default-footer
                    class="elevation-1"
                >
                    <template v-slot:item.name="{ item }">
                        <div style="position: relative;">
                            <img
                                class='medals'
                                :src="getMedal(values.indexOf(item))"
                                draggable="false"
                                ondragstart="return false;"
                                v-if="values.indexOf(item) < 3"
                            />
                            <div style="position: relative; left: 25px;">
                                {{item.name}}
                            </div>
                        </div>
                    </template>
                </v-data-table>
                <div class="py-10 text-center">
                    <v-btn
                        color="orange"
                        dark
                        @click="SendBackToRoom"
                        :disabled="!isMaster"
                    >Back to room</v-btn>
                </div>
                <animdiv
                    name="clickable"
                    loop
                />
                <div id='giftanim' />
                <div id='itemanim' />
                <div
                    v-if="showItem"
                    class='itemround elevation-15'
                    :style="getStyleitem()"
                />
                <div
                    id='closeHitBox'
                    @click="closeItem"
                    v-if="showItem"
                >
                </div>

                <div
                    id='hitboxgift'
                    v-if="clickableGift"
                    @click="clickGift"
                />
            </div>
            <div
                v-if="showItem"
                id='itemdesc'
                style=""
            >
                <span>You received a </span>
                <span
                    class='text-capitalize'
                    :style="getStyleCategoryText()"
                >{{this.category}} </span>
                <span>{{this.giftType}} !</span>
            </div>
        </div>

    </div>
</template>

<script>
import Lottie from 'lottie-web'
import XpBar from './XpBar'
import animdiv from '../../../utils/components/anim/AnimDiv'
import { mapGetters } from 'vuex'
export default {
    components: {
        XpBar, animdiv
    },
    data () {
        return {
            colors: {
                common: '#27ae60',
                rare: '#2980b9',
                mythic: '#9b59b6',
                legendary: '#f39c12'
            },
            showLevelUp: false,
            anim: () => { },
            medals: ['goldmedal', 'silvermedal', 'bronzemedal'],
            allGifts: [],
            clickableGift: false,
            giftItem: 1000,
            giftType: undefined,
            category: 'common',
            showItem: false
        }
    },
    props: {
        gameName: {
            type: String
        },
        headers: {
            type: Array
        },
        values: {
            types: Array
        }

    },
    destroyed () {
        this.$store.commit('animclickable', 'finished')
    },
    methods: {
        SendBackToRoom () {
            this.ws.send(JSON.stringify({ command: 'BackToRoom' }))
        },
        getStyleitem () {
            return {
                backgroundImage: `url("https://funfuelbucket.s3.amazonaws.com/${this.giftType}/${this.giftItem}.svg")`
            }
        },
        getStyleLevelUp () {
            return {
                fontFamily: 'Mont',
                opacity: this.showLevelUp ? '1' : '0',
                fontSize: '2vmin'
            }
        },
        getStyleCategoryText () {
            return {
                color: this.colors[this.category]
            }
        },
        getMedal (index) {
            return require('../../assets/room/' + this.medals[index] + '.svg')
        },
        levelup (numberOfLevelUps) {
            this.showLevelUp = true
            setTimeout(() => { this.showLevelUp = false }, 1000)
            this.receiveItem(this.allGifts[numberOfLevelUps][0].charCodeAt(0), this.allGifts[numberOfLevelUps][1])
        },
        notLogged () {
            this.$refs.xpBar.notLogged()
        },
        receiveXp (xpInfos) {
            this.$refs.xpBar.xpUp(xpInfos.previousXp, xpInfos.previousLevel, xpInfos.newXp, xpInfos.newLevel, xpInfos.firstWin, xpInfos.winner, xpInfos.timeIg, xpInfos.total)
        },
        receiveItem (item, type) {
            this.giftItem = item
            this.giftType = type
            const trad = {
                1: 'common',
                2: 'rare',
                3: 'mythic',
                4: 'legendary'
            }
            this.category = trad[Math.floor(item / 1000)]
            this.itemAnim()
        },
        closeItem () {
            this.showItem = false
            if (this.anim !== undefined) {
                this.anim.destroy()
            }
            this.$refs.xpBar.clickNextLevel()
        },
        setGifts (gifts) {
            this.allGifts = gifts
        },
        clickGift () {
            this.$store.commit('animclickable', 'finished')
            this.clickableGift = false
            if (this.anim !== undefined) {
                this.anim.destroy()
            }
            setTimeout(_ => {
                this.anim = Lottie.loadAnimation({
                    container: document.getElementById('itemanim'),
                    renderer: 'svg',
                    loop: false,
                    autoplay: false,
                    path: `/anims/${this.category}_item.json`
                })
                this.anim.setSpeed(0.8)

                this.anim.play()
            }, 100)
            setTimeout(_ => {
                this.showItem = true
            }, 500)
        },
        itemAnim () {
            setTimeout(_ => {
                this.anim = Lottie.loadAnimation({
                    container: document.getElementById('giftanim'),
                    renderer: 'svg',
                    loop: false,
                    autoplay: false,
                    path: '/anims/gift.json'
                })
                this.anim.setSpeed(1)
                this.anim.onComplete = _ => {
                    // this.anim.destroy()
                }
                this.anim.play()
            })

            setTimeout(() => {
                this.$store.commit('animclickable', 'play')

                this.clickableGift = true
            }, 1000)
        },
        play () {
            setTimeout(_ => {
                this.anim = Lottie.loadAnimation({
                    container: document.getElementById('scoreboardanim'),
                    renderer: 'svg',
                    loop: false,
                    autoplay: false,
                    path: '/anims/scoreboard.json'
                })
                this.anim.setSpeed(1)

                this.anim.play()
            })
        }
    },
    mounted () {
        this.play()
        this.$store.dispatch('unlockAchievement', '7gqwedqwrqweewqgq')
        if (this.playersData[this.publicId].userData.level >= 10) {
            this.$store.dispatch('unlockAchievement', '010ec5967322b5a0557a')
        }
    },
    computed: {
        ...mapGetters(['playersData', 'publicId', 'isMaster', 'ws'])
    }
}
</script>

<style scoped>
.txtcenter {
    text-align: center;
    width: 100%;
}
.medals {
    position: absolute;
    left: -10px;
    top: -10px;
    width: 35px;
    height: 35px;
}
#tableContainer {
    position: relative;
    left: 50%;
    width: 70%;
    transform: translateX(-50%);
}
#innergamecomp {
    position: absolute;
    /* background-color: brown; */
    width: 100%;
    height: calc(100vh - 48px);
    margin-top: 48px;
}
#giftanim {
    position: absolute;
    height: 60vmin;
    width: 60vmin;
    left: 50%;
    top: 50%;

    transform: translate(-50%, -50%);
    pointer-events: none;
}
#itemanim {
    position: absolute;
    height: 40vmin;
    width: 40vmin;
    left: 50%;
    top: 50%;

    transform: translate(-50%, -50%);

    pointer-events: none;
}
#scoreboardanim {
    position: relative;
    height: 150px;
    left: 50%;
    bottom: 0%;
    transform: translateX(-50%);
    pointer-events: none;
}
#bg {
    background: rgb(48, 47, 89);
    background: radial-gradient(
        circle,
        rgba(48, 47, 89, 1) 0%,
        rgba(4, 5, 18, 1) 100%
    );
    background-origin: padding-box;
    height: 100vh;
}
#title {
    font-family: "Mont";
    font-size: 5vmin;
    text-align: center;
    width: 100%;
    text-transform: capitalize;
}
#hitboxgift {
    position: absolute;
    width: 40vmin;
    height: 40vmin;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -35%);
    cursor: pointer;
}
#animclickable {
    position: absolute;
    width: 50vmin;
    height: 50vmin;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -30%);
    pointer-events: none;
}
#itemdesc {
    font-family: "Mont";
    font-size: 30px;
    font-weight: 500;
    position: absolute;
    top: 70%;
    left: 50%;
    transform: translate(-50%, -50%);
}
#closeHitBox {
    position: absolute;
    width: 40vmin;
    height: 40vmin;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -35%);
    cursor: pointer;
}
.itemround {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    height: 100px;
    width: 100px;
    border-radius: 50%;
    background-position: center center;
    background-size: cover;
}
</style>
