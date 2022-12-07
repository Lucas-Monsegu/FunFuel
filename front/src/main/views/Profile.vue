<template>
    <div
        v-if="isMe"
        id="profile"
    >
        <v-container>
            <v-row id="toprow">
                <v-col id="profileCard">
                    <profileCard
                        id="card"
                        :name="username"
                        :level="level"
                        :avatar="avatar"
                        :pattern="pattern"
                        :isMe="isMe"
                        @setName="setName"
                        @setSync="setSync"
                    />
                </v-col>
                <div id='save'>
                    <v-btn
                        v-if="isMe && changed"
                        class="ma-0"
                        rounded
                        color="success"
                        @click="save"
                        :loading="loading"
                    >
                        <span>Save</span>
                        <v-icon right>
                            mdi-content-save
                        </v-icon>
                    </v-btn>
                </div>

                <v-btn
                    v-if="isMe"
                    id="logout"
                    class="ma-0"
                    rounded
                    color="red"
                    @click="$store.dispatch('logout')"
                >
                    <span>Log Out</span>
                    <v-icon right>
                        mdi-logout
                    </v-icon>
                </v-btn>

            </v-row>
            <v-row id='middlerow'>
                <v-col cols="12">
                    <xpBar>
                    </xpBar>
                </v-col>

            </v-row>

            <v-row
                id="bottomrow"
                v-if="isMe"
            >
                <v-col cols="8">
                    <unlockables
                        :isMe="isMe"
                        :unlockedAvatars="unlockedAvatars"
                        :unlockedPatterns="unlockedPatterns"
                        :unlockedAchievements="unlockedAchievements"
                        @setAvatar="setAvatar"
                        @setPattern="setPattern"
                        @setAchievement="setAchievement"
                    />
                </v-col>
                <v-col cols="4">
                    <stats />
                </v-col>
            </v-row>
        </v-container>
    </div>
    <div
        v-else
        id="profile"
    >
        <v-container>
            <v-row id="toprow">
                <v-col id="profileCard">
                    <profileCard
                        id="card"
                        :name="getname"
                        :level="level"
                        :avatar="getavatar"
                        :pattern="getpattern"
                        :isMe="isMe"
                    />
                </v-col>
            </v-row>
            <v-row id="bottomrow">
                <v-col cols="8">
                    <unlockables
                        :isMe="isMe"
                        :unlockedAvatars="unlockedAvatars"
                        :unlockedPatterns="unlockedPatterns"
                        :unlockedAchievements="unlockedAchievements"
                    />
                </v-col>
                <v-col cols="4">
                    <stats />
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import profileCard from '@/main/components/profile/ProfileCard.vue'
import unlockables from '@/main/components/profile/Unlockables.vue'
import stats from '@/main/components/profile/Stats.vue'
import xpBar from '@/main/components/profile/XpBarProfile.vue'
import axios from 'axios'
import anime from 'animejs'
export default {
    components: {
        profileCard,
        unlockables,
        stats,
        xpBar
    },
    data () {
        return {
            id: this.$route.params.id,
            getname: '',
            level: 1,
            xp: 0,
            getpattern: null,
            getavatar: null,
            getachievement: null,
            unlockedPatterns: new Set(),
            unlockedAvatars: new Set(),
            unlockedAchievements: new Set(),
            loading: false,
            changed: false
        }
    },
    computed: {
        isMe () {
            return this.userPublicId === this.id
        },
        ...mapGetters(['connectedState', 'userPublicId', 'syncName', 'avatar', 'username', 'pattern'])
    },
    mounted () {
        this.$store.dispatch('getData')
        axios.get(`${process.env.VUE_APP_MAINURL}/public-id-to-user?publicId=${this.id}`)
            .then(res => {
                const data = res.data
                this.getname = data.username
                this.level = data.level
                this.xp = data.xp
                this.getpattern = data.pattern?.charCodeAt()
                this.unlockedPatterns = new Set(Array.from(data.uPattern).map(e => e.charCodeAt()))
                this.getavatar = data.avatar?.charCodeAt()
                this.unlockedAvatars = new Set(Array.from(data.uAvatar).map(e => e.charCodeAt()))
                this.getachievement = data.achievement?.charCodeAt()
                this.unlockedAchievements = new Set(Array.from(data.uAchievement).map(e => e.charCodeAt()))
            })
            .catch(_ => {
            })
    },
    watch: {
        changed (val, old) {
            if (!old && val) {
                this.animeSave()
            }
        }
    },
    methods: {
        setAvatar (avatar) {
            this.$store.commit('setAvatar', avatar)
            this.changed = true
        },
        setPattern (pattern) {
            this.$store.commit('setPattern', pattern)
            this.changed = true
        },
        setAchievement (achievement) {
            this.$store.commit('setAchievement', achievement)
            this.changed = true
        },
        setName (name) {
            this.$store.commit('setUsername', name)
            this.changed = true
        },
        setSync (sync) {
            this.$store.commit('setSync', sync)
            this.changed = true
        },
        async save () {
            this.loading = true
            this.$store.dispatch('saveProfile').finally(_ => {
                this.animeSaved()
            })
        },
        animeSave () {
            this.$nextTick(_ => {
                anime({
                    targets: '#save',
                    scale: [0, 1],
                    translateY: ['-50%', '-50%'],
                    duration: 400
                })
            })
        },
        animeSaved () {
            this.$nextTick(_ => {
                anime({
                    targets: '#save',
                    scale: [1, 0],
                    translateY: ['-50%', '-50%'],
                    duration: 200,
                    easing: 'easeInBack'
                }).finished.then(_ => {
                    this.loading = false
                    this.changed = false
                })
            })
        }
    }
}
</script>

<style scoped>
#toprow {
    position: relative;
    height: 7.76vw;
    margin: 0;
}
#logout {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
}
#middlerow {
    position: relative;
}
#save {
    position: absolute;
    left: 0;
    top: 50%;
}
#profileCard {
    display: inline-block;
    width: 100%;
    padding: 0;
}
#profile {
    background: rgb(48, 47, 89);
    background: radial-gradient(
        circle,
        rgba(48, 47, 89, 1) 0%,
        rgba(4, 5, 18, 1) 100%
    );
    background-origin: padding-box;
    padding-top: 48px;
    min-height: 100vh;
}
</style>
