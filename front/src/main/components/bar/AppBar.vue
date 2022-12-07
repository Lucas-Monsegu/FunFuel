<template>
    <div id="bar">
        <v-app-bar
            color="transparent"
            dense
            flat
            absolute
        >
            <img
                src="@/main/assets/homepage/title.svg"
                style="width: 100px; cursor: pointer;"
                @click="clickHome"
            >
            <v-spacer></v-spacer>
            <img
                src="@/main/assets/homepage/kickstarter_badge.png"
                style="width: 40px; cursor: pointer; position: absolute; left: 130px;"
                @click="kickstarter"
            />
            <div class="my-2">
                <v-btn
                    text
                    small
                    @click="clickGames"
                >Games</v-btn>
            </div>
            <v-spacer></v-spacer>
            <login v-if="connectedState === 1" />
            <profile v-else />
        </v-app-bar>
    </div>
</template>
<script>
import login from './Login'
import profile from './Profile'
import { mapGetters } from 'vuex'
export default {
    components: { login, profile },
    methods: {
        clickHome () {
            if (this.$route.path !== '/') {
                this.$router.push('/')
            }
        },
        clickGames () {
            if (this.$route.path !== '/games') {
                this.$router.push('/games')
            }
        },
        kickstarter () {
            window.open('https://www.kickstarter.com/projects/lucas-m/funfuel-multiplayer-web-games-platform', '_blank')
        }
    },
    computed: {
        ...mapGetters(['connectedState'])
    }
}
</script>

<style scoped>
.sizing {
    font-size: 5vw;
}
</style>
