<template>
    <div id='bg'>
        <img
            src="@/main/assets/games/main_wave.svg"
            id='wave'
            draggable="false"
            ondragstart="return false;"
        />
        <img
            src="@/main/assets/games/long_hidden.svg"
            id='long_hidden'
            draggable="false"
            ondragstart="return false;"
        />
        <img
            src="@/main/assets/games/bottom_left.svg"
            id='bottom_left'
            draggable="false"
            ondragstart="return false;"
        />
        <img
            src="@/main/assets/games/bottom_right.svg"
            id='bottom_right'
            draggable="false"
            ondragstart="return false;"
        />
        <img
            src="@/main/assets/games/left_circle.svg"
            id='circle_cut'
            draggable="false"
            ondragstart="return false;"
        />
        <img
            src="@/main/assets/games/top_left.svg"
            id='top_left'
            draggable="false"
            ondragstart="return false;"
        />
        <img
            src="@/main/assets/games/left.svg"
            id='left'
            draggable="false"
            ondragstart="return false;"
        />
        <img
            src="@/main/assets/games/left_bar.svg"
            id='left_bar'
            draggable="false"
            ondragstart="return false;"
        />
        <img
            src="@/main/assets/games/left_drizzle.svg"
            id='left_drizzle'
            draggable="false"
            ondragstart="return false;"
        />
        <img
            src="@/main/assets/games/left_circle.svg"
            id='left_circle'
            draggable="false"
            ondragstart="return false;"
        />
        <img
            src="@/main/assets/games/bot_drizzle.svg"
            id='bot_drizzle'
            draggable="false"
            ondragstart="return false;"
        />
        <img
            src="@/main/assets/games/bot_x.svg"
            id='bot_x'
            draggable="false"
            ondragstart="return false;"
        /><img
            src="@/main/assets/games/top_right_u.svg"
            id='top_right_u'
            draggable="false"
            ondragstart="return false;"
        />
        <img
            src="@/main/assets/games/top_right_t.svg"
            id='top_right_t'
            draggable="false"
            ondragstart="return false;"
        />
        <img
            src="@/main/assets/games/right_round.svg"
            id='right_round'
            draggable="false"
            ondragstart="return false;"
        />
        <img
            src="@/main/assets/games/right_cut.svg"
            id='right_cut'
            draggable="false"
            ondragstart="return false;"
        />
        <img
            src="@/main/assets/games/right_bar.svg"
            id='right_bar'
            draggable="false"
            ondragstart="return false;"
        />

        <img
            src="@/main/assets/games/bottom_right_round.svg"
            id='bottom_right_round'
            draggable="false"
            ondragstart="return false;"
        />
        <img
            src="@/main/assets/games/left_circle.svg"
            id='right_circle'
            draggable="false"
            ondragstart="return false;"
        />
        <img
            src="@/main/assets/games/left_arrows.svg"
            id='left_arrows'
            draggable="false"
            ondragstart="return false;"
        />

        <img
            src="@/main/assets/games/bottom_x.svg"
            id='bottom_x'
            draggable="false"
            ondragstart="return false;"
        />
        <img
            src="@/main/assets/games/bottom_h.svg"
            id='bottom_h'
            draggable="false"
            ondragstart="return false;"
        />
        <img
            src="@/main/assets/games/right_circle.svg"
            id='right_circle_red'
            draggable="false"
            ondragstart="return false;"
        />
        <img
            src="@/main/assets/games/right_circle.svg"
            id='bottom_circle_red'
            draggable="false"
            ondragstart="return false;"
        />
        <img
            src="@/main/assets/games/left_x.svg"
            id='left_x'
            draggable="false"
            ondragstart="return false;"
        />
        <img
            src="@/main/assets/games/top_points.svg"
            id='top_points'
            draggable="false"
            ondragstart="return false;"
        />
        <img
            src="@/main/assets/games/tilted_points.svg"
            id='tilted_points'
            draggable="false"
            ondragstart="return false;"
        />
        <div id='innergamecomp'>
            <div id='frame'>
                <v-card
                    outlined
                    color="rgb(0,0,0, 0.4)"
                    min-height="95%"
                >
                    <v-container
                        id="scroll-target"
                        style="max-height: 100%"
                        class="overflow-y-auto"
                    >
                        <v-row>
                            <v-col
                                v-for="(gameName) in games"
                                :key="gameName"
                                sm=6
                                md=4
                                cols=12
                            >
                                <GameCard :gameName="gameName" />
                            </v-col>

                        </v-row>
                    </v-container>
                </v-card>
            </div>
        </div>
    </div>
</template>

<script>
import GameCard from '@/main/components/games/GameCard.vue'

export default {
    components: {
        GameCard
    },
    data () {
        return {
            games: this.$store.getters.getAllGames
        }
    }
}
</script>

<style scoped>
#bg {
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgb(68, 16, 102);
    background: linear-gradient(
        90deg,
        rgba(68, 16, 102, 1) 0%,
        rgba(169, 0, 141, 1) 100%
    );
}
#tilted_points {
    position: absolute;
    bottom: 16%;
    height: 10%;
    right: 30%;
}
#top_points {
    position: absolute;
    top: 2%;
    height: 2%;
    left: 32%;
}
#left_x {
    position: absolute;
    bottom: 35%;
    height: 5%;
    left: 13%;
}
#bottom_circle_red {
    position: absolute;
    bottom: 18%;
    height: 5%;
    left: 39%;
}
#circle_cut {
    position: absolute;
    top: 6%;
    height: 12%;
    left: 15%;
}
#right_circle_red {
    position: absolute;
    top: 28%;
    height: 5%;
    right: 8%;
}
#bottom_h {
    position: absolute;
    bottom: 3%;
    height: 13%;
    right: 47%;
}
#bottom_x {
    position: absolute;
    bottom: 10%;
    height: 3%;
    right: 40%;
}
#top_x {
    position: absolute;
    top: 2%;
    height: 2%;
    right: 30%;
}
#left_arrows {
    position: absolute;
    top: 19%;
    height: 4%;
    right: 15%;
}
#right_circle {
    position: absolute;
    bottom: 20%;
    height: 10%;
    right: 20%;
}
#bottom_right_round {
    position: absolute;
    bottom: 23%;
    height: 15%;
    right: 0%;
}
#right_bar {
    position: absolute;
    top: 42%;
    height: 17%;
    right: 6%;
}
#right_cut {
    position: absolute;
    top: 44%;
    height: 20%;
    right: 0%;
}
#right_round {
    position: absolute;
    top: 7%;
    height: 25%;
    right: 0%;
}
#top_right_t {
    position: absolute;
    top: 0%;
    height: 17%;
    right: 5%;
}
#top_right_u {
    position: absolute;
    top: 0%;
    height: 17%;
    right: 5%;
}
#bot_x {
    position: absolute;
    bottom: 6%;
    height: 4%;
    left: 35%;
}
#bot_drizzle {
    position: absolute;
    bottom: 6%;
    height: 8%;
    left: 25%;
}
#left_circle {
    position: absolute;
    top: 27%;
    height: 6%;
    left: 6%;
}
#left_drizzle {
    position: absolute;
    bottom: 47%;
    height: 10%;
    left: 5%;
}
#left_bar {
    position: absolute;
    bottom: 40%;
    height: 20%;
    left: 6%;
}
#long_hidden {
    position: absolute;
    bottom: 10%;
    height: 25%;
    left: 11%;
}
#left {
    position: absolute;
    top: 35%;
    height: 20%;
    left: 0px;
}
#bottom_right {
    position: absolute;
    bottom: 0px;
    height: 25%;
    right: 0px;
}
#top_left {
    position: absolute;
    top: 0px;
    height: 25%;
    left: 0px;
}
#wave {
    position: absolute;
    bottom: 0px;
    height: 70%;
    right: 0px;
    overflow: hidden;
}
#bottom_left {
    position: absolute;
    bottom: 0px;
    height: 30%;
    left: 0px;
}
#frame {
    position: absolute;
    width: 60%;
    height: 100%;
    left: 50%;
    transform: translateX(-50%);
}
#innergamecomp {
    position: absolute;
    /* background-color: brown; */
    width: 100%;
    height: calc(100vh - 48px);
    margin-top: 48px;
}
</style>
