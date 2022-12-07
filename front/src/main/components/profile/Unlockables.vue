<template>
    <v-card>
        <v-toolbar
            flat
            color="#3498db"
            dark
        >

            <v-toolbar-title id="title">
                Unlockables
            </v-toolbar-title>
            <img
                id="chest"
                src="@/main/assets/profile/unlockables/chest.svg"
            />
        </v-toolbar>
        <v-tabs vertical>
            <v-tab
                v-for="(item, index) in items"
                :key="index"
            >
                {{ item.title }}
                <v-icon right>{{ item.icon }}</v-icon>
            </v-tab>
            <v-tab-item>
                <v-card flat>
                    <v-card-text>
                        <div
                            v-for="(achievements, category) in achievementList"
                            :key="category"
                        >
                            <v-subheader
                                class="pa-0 headline text-capitalize"
                                :style="{ color: colors[category] }"
                            >
                                {{ category }}
                            </v-subheader>
                            <v-row>
                                <v-col
                                    v-for="(item, index) in achievements"
                                    :key="index"
                                    class="achievcol"
                                >
                                    <v-tooltip
                                        top
                                        :disabled="!isMe || !isUnlockedAchievement(index)"
                                    >
                                        <template v-slot:activator="{ on }">
                                            <div
                                                class="achievement"
                                                :style="getStyleAchievement(index)"
                                                v-on="on"
                                                v-ripple="isUnlockedAchievement(index)"
                                                @click="isUnlockedAchievement(index) && $emit('setAchievement', parseInt(index))"
                                            />
                                        </template>
                                        <span>{{item.description}}</span>
                                    </v-tooltip>
                                    <div
                                        class="text-center mt-2"
                                        :style="getStyleTextAchievement(category, index)"
                                    >
                                        {{ item.title }}
                                    </div>
                                </v-col>
                            </v-row>
                        </div>
                    </v-card-text>
                </v-card>
            </v-tab-item>
            <v-tab-item>
                <v-card flat>
                    <v-card-text>
                        <div
                            v-for="(avatars, category) in avatarList"
                            :key="category"
                        >
                            <v-subheader
                                class="pa-0 headline text-capitalize"
                                :style="{ color: colors[category] }"
                            >
                                {{ category }}
                            </v-subheader>
                            <v-row>
                                <v-col
                                    v-for="(item, index) in avatars"
                                    :key="index"
                                    class="itemcol"
                                >
                                    <div
                                        :style="getCircle(category)"
                                        v-if="isMe && avatar === item"
                                    />
                                    <v-hover>
                                        <template v-slot="{ hover }">
                                            <div
                                                :class="{ 'itemround': true, 'elevation-15': hover && isUnlockedAvatar(item) }"
                                                :style="getStyleAvatar(item)"
                                                v-ripple="isUnlockedAvatar(item)"
                                                @click="isUnlockedAvatar(item) && $emit('setAvatar', item)"
                                            />
                                        </template>
                                    </v-hover>
                                </v-col>
                            </v-row>
                        </div>
                    </v-card-text>
                </v-card>
            </v-tab-item>
            <v-tab-item>
                <v-card flat>
                    <v-card-text>
                        <div
                            v-for="(avatars, category) in patternList"
                            :key="category"
                        >
                            <v-subheader
                                class="pa-0 headline text-capitalize"
                                :style="{color: colors[category]}"
                            >
                                {{ category }}
                            </v-subheader>
                            <v-row>
                                <v-col
                                    v-for="(item, index) in avatars"
                                    :key="index"
                                    class="itemcol"
                                >
                                    <div
                                        :style="getCircle(category)"
                                        v-if="isMe && pattern === item"
                                    />
                                    <v-hover>
                                        <template v-slot="{ hover }">
                                            <div
                                                :class="{ 'itemround': true, 'elevation-15': hover && isUnlockedPattern(item) }"
                                                id="avatarprofile"
                                                :style="getStylePattern(item)"
                                                v-ripple="isUnlockedPattern(item)"
                                                @click="isUnlockedPattern(item) && $emit('setPattern', item)"
                                            />
                                        </template>
                                    </v-hover>
                                </v-col>
                            </v-row>
                        </div>
                    </v-card-text>
                </v-card>
            </v-tab-item>
            <v-tab-item>
                <v-card flat>
                    <v-card-text>
                        <div class="text-center headline">
                            Coming soon...
                        </div>
                    </v-card-text>
                </v-card>
            </v-tab-item>
        </v-tabs>
    </v-card>
</template>

<script>
import achievements from './achievements.js'
import { mapGetters } from 'vuex'
export default {
    props: {
        isMe: {
            type: Boolean,
            required: true
        },
        unlockedAvatars: {
            type: Set,
            required: true
        },
        unlockedPatterns: {
            type: Set,
            required: true
        },
        unlockedAchievements: {
            type: Set,
            required: true
        }
    },
    data () {
        return {
            colors: {
                common: '#27ae60',
                rare: '#2980b9',
                mythic: '#9b59b6',
                legendary: '#f39c12'
            },
            items: [
                { title: 'Achievements', icon: 'mdi-trophy' },
                { title: 'Avatars', icon: 'mdi-emoticon-cool' },
                { title: 'Patterns', icon: 'mdi-drawing' },
                { title: 'Cards', icon: 'mdi-cards' }
            ],
            achievementList: achievements,
            avatars: {
                common: 29,
                rare: 21,
                mythic: 10,
                legendary: 7
            },
            patterns: {
                common: 34,
                rare: 20,
                mythic: 17,
                legendary: 10
            }

        }
    },
    computed: {
        ...mapGetters(['avatar', 'pattern', 'achievement']),
        avatarList () {
            return {
                common: new Set([...Array(this.avatars.common).keys()].map(el => { return el + 1000 })),
                rare: new Set([...Array(this.avatars.rare).keys()].map(el => { return el + 2000 })),
                mythic: new Set([...Array(this.avatars.mythic).keys()].map(el => { return el + 3000 })),
                legendary: new Set([...Array(this.avatars.legendary).keys()].map(el => { return el + 4000 }))
            }
        },
        patternList () {
            return {
                common: new Set([...Array(this.patterns.common).keys()].map(el => { return el + 1000 })),
                rare: new Set([...Array(this.patterns.rare).keys()].map(el => { return el + 2000 })),
                mythic: new Set([...Array(this.patterns.mythic).keys()].map(el => { return el + 3000 })),
                legendary: new Set([...Array(this.patterns.legendary).keys()].map(el => { return el + 4000 }))
            }
        }
    },
    methods: {
        isUnlockedAvatar (item) {
            return this.unlockedAvatars.has(item)
        },
        isUnlockedPattern (item) {
            return this.unlockedPatterns.has(item)
        },
        isUnlockedAchievement (item) {
            return this.unlockedAchievements.has(parseInt(item))
        },
        getStyleAvatar (item) {
            const unlocked = this.isUnlockedAvatar(item)

            return {
                filter: `brightness(${unlocked ? '100%' : '25%'})`,
                backgroundImage: `url("https://funfuelbucket.s3.amazonaws.com/avatar/${item}.svg")`,
                cursor: unlocked ? 'pointer' : 'auto'
            }
        },
        getStylePattern (item) {
            const unlocked = this.isUnlockedPattern(item)
            return {
                filter: `brightness(${unlocked ? '100%' : '25%'})`,
                backgroundImage: `url("https://funfuelbucket.s3.amazonaws.com/pattern/${item}.svg")`,
                cursor: unlocked ? 'pointer' : 'auto',
                backgroundColor: '#3498db'
            }
        },
        getStyleAchievement (item) {
            const unlocked = this.isUnlockedAchievement(item)
            return {
                filter: `brightness(${unlocked ? '100%' : '25%'})`,
                backgroundImage: `url("${require(`@/main/assets/profile/unlockables/${Math.floor(item / 1000)}.svg`)}")`,
                cursor: unlocked ? 'pointer' : 'auto'
            }
        },
        getStyleTextAchievement (category, item) {
            if (this.isMe && parseInt(item) === this.achievement) {
                return {
                    color: this.colors[category]
                }
            }
        },
        getCircle (category) {
            const color = this.colors[category]
            return {
                position: 'absolute',
                border: `3px solid ${color}`,
                borderRadius: '50%',
                width: '66px',
                height: '66px',
                zIndex: '86',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
            }
        }
    }
}
</script>

<style scoped>
.achievcol {
    flex-grow: 0;
    min-width: 110px;
    padding-left: 0;
    padding-right: 0;
}
.itemcol {
    flex-grow: 0;
    position: relative;
}
.itemround {
    height: 60px;
    width: 60px;
    border-radius: 50%;
    background-position: center center;
    background-size: cover;
}
.achievement {
    margin: auto;
    height: 60px;
    width: 60px;
    background-position: center center;
}
#chest {
    height: 80%;
    padding-left: 10px;
}
#title {
    font-family: "Mont";
}
</style>
