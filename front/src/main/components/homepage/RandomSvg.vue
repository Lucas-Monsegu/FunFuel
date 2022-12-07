<template>
    <div>
        <img
            @click="clicked"
            id="random"
            :src="getUrl"
            ondragstart="return false;"
        />
    </div>
</template>
<script>
import anime from 'animejs'
import Random from '@/utils/js/Random'

export default {
    data () {
        return {
            svgs: ['chest', 'pig', 'mana', 'staff', 'knife', 'scar', 'rpg', 'grenade', 'rifle',
                'sword', 'venonat', 'pokeball', 'minecraft_sword', 'minecraft_skeleton',
                'minecraft_table', 'minecraft_pickaxe', 'spyro', 'knuckles', 'cuphead',
                'pubg', 'subnautica', 'chess', 'triforce', 'toad', 'worms', 'crash', 'ahri', 'unturned',
                'rubiks', 'parchement'
            ],
            seenSvg: new Set(),
            selectedSvg: null,
            randomElement: null
        }
    },
    mounted () {
        this.randomElement = document.getElementById('random')
        this.selectedSvg = Random.fromArray(this.svgs)
        this.seenSvg.add(this.selectedSvg)
        if (this.seenSvg.size >= this.svgs.length) {
            this.$store.dispatch('unlockAchievement', '1ef068a272da5199822b')
        }
    },
    computed: {
        getUrl () {
            return require(`@/main/assets/homepage/randomsvgs/${this.selectedSvg || 'chest'}.svg`)
        }
    },
    methods: {

        clicked () {
            this.selectedSvg = Random.fromArray(this.svgs)
            anime({
                targets: this.randomElement,
                scale: [0, 1],
                duration: 400,
                easing: 'easeOutElastic'
            })
        }
    }
}
</script>
<style scoped>
#random {
    height: 50px;
    width: 50px;
}
</style>
