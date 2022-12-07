<template>
    <v-app id="app">
        <app-bar>
        </app-bar>
        <AnimAchievement />
        <snack />
        <v-content id="content">
            <router-view />
        </v-content>
    </v-app>
</template>

<script>
import AppBar from '@/main/components/bar/AppBar'
import Snack from '@/utils/components/anim/Snack'
import AnimAchievement from '@/main/components/global/AnimAchievement.vue'
export default {
    components: {
        AppBar,
        Snack,
        AnimAchievement
    },
    mounted () {
        this.$store.dispatch('getData')
    }
}
</script>

<style>
html,
body {
    overflow: auto !important;
}
img,
svg {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
@font-face {
    font-family: "Mont";
    src: url("./main/assets/font/Mont-Bold.ttf") format("truetype");
}
</style>
