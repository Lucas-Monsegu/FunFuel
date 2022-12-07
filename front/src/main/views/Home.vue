<template>
    <div>
        <div id='catchPhrase'>
            Simple fun multiplayer games
        </div>
        <auto-resize-canvas
            canvasClass="test"
            canvasId="test2"
            :zIndex="2"
            :top="0"
            :left="0"
            :width="100"
            :height="100"
        />

        <main-svgs />

        <div id="games">
            <v-row
                class="py-10"
                no-gutters
                justify="center"
            >
                <v-col>
                    <div id='featuredGames'>Featured Games:</div>

                </v-col>
                <v-col>
                    <GameCard
                        image="games/blindTest/assets/main_image"
                        gameName="blindTest"
                    />
                </v-col>

                <v-col>
                    <GameCard
                        image="games/mentalist/assets/double-agent"
                        gameName="mentalist"
                    />
                </v-col>
            </v-row>

            <v-row no-gutters>
                <v-col class='pb-5'>
                    <v-btn
                        x-large
                        dark
                        @click="seeAllGameClick"
                    >SEE ALL GAMES</v-btn>
                </v-col>
            </v-row>
        </div>
    </div>
</template>

<script>
import MainSvgs from '@/main/components/homepage/SplashScreen'
import AutoResizeCanvas from '@/main/components/homepage/AutoResizeCanvas'
import GameCard from '@/main/components/games/GameCard.vue'
export default {
    components: { MainSvgs, AutoResizeCanvas, GameCard },
    data () {
        return {
            a: ''
        }
    },
    methods: {
        seeAllGameClick () {
            this.$router.push('/games')
        }
    }
}
</script>

<style scoped>
#catchPhrase {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 640px;
    font-family: "Mont";
    font-size: 25px;
}
#featuredGames {
    font-family: "Mont";
    font-size: 5vmin;
    position: relative;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}
#mainsvg {
    position: relative;
    color: #fff;
    text-align: center;
}
#liquidsvg {
    margin-bottom: -7px;
}
h1 {
    font-size: 6rem;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
        Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
    margin: 0;
}
#games {
    background: rgb(247, 0, 104);
    background: linear-gradient(
        0deg,
        rgba(68, 16, 102, 1) 0%,
        rgba(247, 0, 104, 1) 100%
    );
    text-align: center;
    color: #fff;
}
</style>
