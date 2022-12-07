<template>
    <div id="goal">
        <animdiv
            name="golf"
            autolock
        />
        <img
            @click="$emit('touched', $event)"
            id="flag"
            src="@/main/assets/homepage/golf/golf_hole.svg"
            ondragstart="return false;"
        />
    </div>
</template>

<script>
import animdiv from '@/utils/components/anim/AnimDiv'
export default {
    components: { animdiv },
    data () {
        return {
        }
    },
    methods: {
        win () {
            this.$store.commit('animgolf', 'play')
        }
    }
}
</script>

<style scoped>
#goal,
#flag {
    width: 60px;
    height: 90px;
    position: absolute;
    cursor: pointer;
}
#animgolf {
    position: absolute;
    width: 200px;
    height: 150px;
    left: -90px;
    top: -60px;
}
</style>
