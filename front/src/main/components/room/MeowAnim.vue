<template>
    <div>
        <animdiv
            name="meow"
            autolock
        />
        <div
            id="cathitbox"
            @click="meow"
        />
    </div>
</template>

<script>
import animdiv from '@/utils/components/anim/AnimDiv'
export default {
    components: {
        animdiv
    },
    methods: {
        meow () {
            this.$store.commit('animmeow', 'play')
        }
    }
}
</script>

<style scoped>
#animmeow {
    position: absolute;
    width: 6vw;
    height: 6vw;
    bottom: 9vw;
    left: 19vw;
}
#cathitbox {
    cursor: pointer;
    position: absolute;
    width: 7vw;
    height: 4vw;
    bottom: 7.8vw;
    left: 17vw;
}
</style>
