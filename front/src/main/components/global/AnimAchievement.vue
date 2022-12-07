<template>
    <div>
        <div
            id='achievementText'
            :style="getStyleSpan()"
            v-if="show"
        >
            {{title}}
        </div>

        <AnimOverlay
            name='achievement'
            :opacity="0"
            :width="800"
        />
    </div>
</template>

<script>
import AnimOverlay from '@/utils/components/anim/AnimOverlay'
import achievements from '../profile/achievements'
export default {
    name: 'animAchievement',
    components: {
        AnimOverlay
    },
    data () {
        return {
            names: {
                1000: 'common',
                2000: 'rare',
                3000: 'mythic',
                4000: 'legendary'
            },
            title: undefined,
            description: undefined,
            category: undefined,
            colors: {
                common: '#27ae60',
                rare: '#2980b9',
                mythic: '#9b59b6',
                legendary: '#f39c12'
            },
            show: false
        }
    },
    methods: {
        getStyleSpan () {
            return {
                color: this.colors[this.category]
            }
        }
    },
    watch: {
        state (achievementId) {
            const category = Math.floor(achievementId / 1000) * 1000
            if (this.names[category] !== undefined) {
                const infos = achievements[this.names[category]][achievementId]
                if (infos !== undefined) {
                    this.title = infos.title
                    this.description = infos.description
                    this.category = this.names[category]
                    setTimeout(() => {
                        this.show = true
                        setTimeout(() => {
                            this.show = false
                        }, 2800)
                    }, 2300)
                }
            }
        }
    },
    computed: {
        state () {
            return this.$store.getters.achievementUnlockedId
        }
    }
}
</script>

<style scoped>
#achievementText {
    position: absolute;
    width: 50%;
    height: 100px;
    top: 25%;
    left: 50%;
    transform: translateX(-50%);
    font-family: "Mont";
    font-size: 35px;
    z-index: 10;
    text-align: center;
}
#achievementTitle {
    position: absolute;
    width: 50%;
    height: 100px;
    top: 15%;
    left: 50%;
    transform: translateX(-50%);
    font-family: "Mont";
    font-size: 35px;
    z-index: 10;
    text-align: center;
}
</style>
