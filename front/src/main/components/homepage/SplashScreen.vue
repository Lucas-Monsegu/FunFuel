<template>
    <div
        id="gradient"
        class="pt-10"
    >

        <div id="svgs">
            <card id="card" />
            <img
                src="@/main/assets/homepage/floating/discord.svg"
                id='discord'
                @click="bubbleDiscord()"
                ondragstart="return false;"
            />

            <img
                src="@/main/assets/homepage/floating/twitter.svg"
                id='twitter'
                @click="bubbleTwitter()"
                ondragstart="return false;"
            />
            <img
                src="@/main/assets/homepage/floating/puzzle.svg"
                id='puzzle'
                class='floating'
                draggable="false"
                ondragstart="return false;"
            />
            <img
                src="@/main/assets/homepage/floating/pad.svg"
                id='pad'
                class='floating'
                draggable="false"
                ondragstart="return false;"
            />
            <keys id="keys" />
            <randomsvg id="randomsvg" />
            <hole
                id="hole"
                ref="hole"
                @touched="bumpBall"
            />
            <golf
                id="golf"
                ref="golf"
                @win="win"
            />
            <img
                v-for="(noise, index) in noises"
                :key="index"
                :src="noiseUrl(noise.src)"
                :style="noiseStyle(noise)"
                ondragstart="return false;"
                class="bob"
            />
            <img
                src="@/main/assets/homepage/title.svg"
                id="maintitle"
                ondragstart="return false;"
            >
            <fire id="fire" />
            <angrybird id="angrybird" />
        </div>
        <img
            id="drip"
            src="@/main/assets/homepage/inverteddrip.svg"
            ondragstart="return false;"
        />
        <animdiv
            name="bubblediscord"
            autolock
        />
        <animdiv
            name="bubbletwitter"
            autolock
        />
    </div>
</template>

<script>
// import anime from 'animejs'
import card from '@/main/components/homepage/Card'
import keys from '@/main/components/homepage/Keys'
import golf from '@/main/components/homepage/Golf'
import hole from '@/main/components/homepage/Hole'
import fire from '@/main/components/homepage/Fire'
import angrybird from '@/main/components/homepage/AngryBird'
import randomsvg from '@/main/components/homepage/RandomSvg'
import animdiv from '@/utils/components/anim/AnimDiv'
export default {
    components: {
        card,
        keys,
        golf,
        fire,
        hole,
        angrybird,
        randomsvg,
        animdiv
    },
    data () {
        return {
            noises: [
                { src: 'noise_cross.svg', left: '300px', top: '50px' },
                { src: 'noise_cross.svg', left: '-500px', top: '600px' },
                { src: 'noise_cross.svg', left: '250px', top: '600px' },
                { src: 'noise_circle.svg', left: '-550px', top: '550px' },
                { src: 'noise_circle.svg', left: '-440px', top: '240px' },
                { src: 'noise_circle.svg', left: '450px', top: '80px' },
                { src: 'noise_ball.svg', left: '-650px', top: '350px' },
                { src: 'noise_ball.svg', left: '-500px', top: '50px' },
                { src: 'noise_ball.svg', left: '-300px', top: '300px' },
                { src: 'noise_ball.svg', left: '-200px', top: '650px' },
                { src: 'noise_ball.svg', left: '620px', top: '200px' },
                { src: 'noise_ball.svg', left: '600px', top: '500px' },
                { src: 'noise_ball.svg', left: '420px', top: '20px' },
                { src: 'noise_triangle.svg', left: '-150px', top: '50px' },
                { src: 'noise_triangle.svg', left: '-350px', top: '450px' },
                { src: 'noise_triangle.svg', left: '400px', top: '620px' },
                { src: 'noise_square.svg', left: '-450px', top: '400px' },
                { src: 'noise_square.svg', left: '450px', top: '350px' },
                { src: 'noise_square.svg', left: '30px', top: '600px' }
            ]
        }
    },
    mounted () {
        const firstrandom = 2 + Math.random() * 27
        setTimeout(() => {
            this.$store.commit('animbubbletwitter', 'play')
        }, (firstrandom) * 1000)
        let secondrandom = 2 + Math.random() * 30
        if (Math.abs(secondrandom - firstrandom) <= 5) {
            secondrandom += 5
        }
        setTimeout(() => {
            this.$store.commit('animbubblediscord', 'play')
        }, secondrandom * 1000)
    },
    methods: {
        bubbleDiscord () {
            window.open('https://discord.gg/W2v8EJp', '_blank')
        },
        bubbleTwitter () {
            window.open('https://twitter.com/FuelFun', '_blank')
        },
        noiseUrl (noise) {
            return require(`@/main/assets/homepage/noise/${noise}`)
        },
        noiseStyle (noise) {
            return {
                position: 'absolute',
                left: '50%',
                marginLeft: noise.left,
                top: noise.top,
                maxWidth: noise.src !== 'noise_ball.svg' ? '25px' : '15px',
                opacity: '30%'
            }
        },
        bumpBall (e) {
            this.$refs.golf.bump()
        },
        win () {
            this.$refs.hole.win()
        }
    }
}
</script>

<style scoped>
.floating {
    animation-name: float;
    -webkit-animation-duration: 1.5s;
    animation-duration: 1.5s;
    -webkit-animation-iteration-count: infinite;
    animation-iteration-count: infinite;
    -webkit-animation-direction: alternate;
    animation-direction: alternate;
    -webkit-animation-timing-function: ease-in-out;
    animation-timing-function: ease-in-out;
}
@keyframes float {
    0% {
        -webkit-transform: translate3d(0, -4px, 0);
        transform: translate3d(0, -4px, 0);
    }
    100% {
        -webkit-transform: translate3d(0, 4px, 0);
        transform: translate3d(0, 4px, 0);
    }
}
#drip {
    display: block;
    width: 100%;
    margin-bottom: -1px;
}
#pad {
    position: absolute;
    left: 50%;
    width: 59px;
    margin-left: -200px;
    top: 100px;
}
#puzzle {
    position: absolute;
    left: 50%;
    width: 59px;
    margin-left: 450px;
    top: 500px;
}
#twitter {
    cursor: pointer;
    position: absolute;
    left: 50%;
    width: 50px;
    margin-left: -450px;
    top: 350px;
    transform: rotate(-5deg);
}

.fire-path {
    position: absolute;
}
#fire {
    position: absolute;
    left: 50%;
    width: 200px;
    margin-left: -100px;
    top: 200px;
}
#maintitle {
    position: absolute;
    left: 50%;
    top: 560px;
    margin-left: -112px;
    width: 225px;
}

#card {
    cursor: pointer;
    transform: rotate(25deg);
    position: absolute;
    left: 50%;
    top: 450px;
    margin-left: 250px;
}
#keys {
    transform: rotate(-25deg);
    position: absolute;
    left: 50%;
    top: 500px;
    margin-left: -350px;
}
#medal {
    cursor: pointer;
    transform: rotate(25deg);
    position: absolute;
    left: 50%;
    top: 200px;
    margin-left: 250px;
}
#golf {
    cursor: pointer;
    position: absolute;
    left: 50%;
    top: 250px;
    margin-left: -250px;
}
#hole {
    position: absolute;
    left: 50%;
    top: 250px;
    margin-left: 450px;
}
#angrybird {
    cursor: grab;
    position: absolute;
    left: 50%;
    top: 100px;
    margin-left: 150px;
}
#animbubblediscord {
    pointer-events: none;

    position: absolute;
    width: 200px;
    height: 200px;
    left: 50%;
    margin-left: 260px;
    top: 90px;
}
#animbubbletwitter {
    pointer-events: none;
    position: absolute;
    left: 50%;
    width: 200px;
    margin-left: -440px;
    top: 210px;
    height: 200px;
}
#randomsvg {
    cursor: pointer;
    position: absolute;
    left: 50%;
    top: 100px;
    margin-left: -350px;
}
#discord {
    cursor: pointer;
    position: absolute;
    left: 50%;
    width: 50px;
    margin-left: 250px;
    cursor: pointer;
    top: 230px;
    transform: rotate(-10deg);
}
#svgs {
    height: 640px;
}
#gradient {
    background: #441066;
    background: radial-gradient(circle, #441066 0%, rgba(4, 5, 18, 1) 100%);
    background-origin: padding-box;
}
@media (max-width: 1060px) {
    #hole,
    #puzzle {
        display: none;
    }
}
@media (max-width: 930px) {
    #pencil {
        display: none;
    }
}
@media (max-width: 780px) {
    #keys {
        display: none;
    }
}
@media (max-width: 735px) {
    #card,
    #randomsvg {
        display: none;
    }
}
@media (max-width: 650px) {
    #pacman {
        display: none;
    }
}
@media (max-width: 520px) {
    #golf {
        display: none;
    }
}
@media (max-width: 425px) {
    #angrybird,
    #pad {
        display: none;
    }
}
</style>
