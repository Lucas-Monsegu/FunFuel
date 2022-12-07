<template>
    <div>
        <img
            id="flask"
            src="@/main/assets/homepage/main_illustration.svg"
            @click="shake"
            ondragstart="return false;"
        />
        <img
            v-for="spark in sparkList"
            :key="spark.key"
            :id="spark.key"
            p
            class="firespark"
            :src="getUrl(spark.path)"
            ondragstart="return false;"
        />
        <svg
            id="path1"
            class="fire-path"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 630.54 402.44"
        >
            <path
                d="M256,378.83s42.64-119.32,42.64-185.32-32.64-57-21.32-130"
                style="fill:none"
            />
        </svg>
        <svg
            id="path2"
            class="fire-path"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 630.54 402.44"
        >
            <path
                d="M280.26,383.76S406.32,344.17,399,282.84s-88.58-174-61.33-219.32"
                style="fill:none"
            />
        </svg>
        <svg
            id="path3"
            class="fire-path"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 630.54 402.44"
        >
            <path
                d="M278.3,390.14s-51.47-182-45.39-218S193.18,21.51,193.18,21.51"
                style="fill:none"
            />
        </svg>
        <svg
            id="path4"
            class="fire-path"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 630.54 402.44"
        >
            <path
                d="M271.34,391.76s52.71-182.95,44.86-231.94S282,34,282,34"
                style="fill:none"
            />
        </svg>
        <svg
            id="path5"
            class="fire-path"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 630.54 402.44"
        >
            <path
                d="M272.9,388s-135.67-116.81-53-171.3,132.77-55.9,168-109S441,9.27,441,9.27"
                style="fill:none"
            />
        </svg>
        <svg
            id="path6"
            class="fire-path"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 630.54 402.44"
        >
            <path
                d="M260.24,382s96.39-124.07,56-144.52S68.61,246.4,52,194.52,89.85,50.42,89.85,50.42"
                style="fill:none"
            />
        </svg>
        <svg
            id="path7"
            class="fire-path"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 630.54 402.44"
        >
            <path
                d="M292.88,370.11s-49.68-163.26-43.7-205.77S275.62.42,275.62.42"
                style="fill:none"
            />
        </svg>

        <svg
            id="path8"
            class="fire-path"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 630.54 402.44"
        >
            <path
                d="M256,382s-95.69-101.74-78-152.61S270.19,62.27,269.65,34"
                style="fill:none"
            />
        </svg>
        <svg
            id="path9"
            class="fire-path"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 630.54 402.44"
        >
            <path
                d="M280.26,390.14S379.46,258.83,352.87,197s-136.23-57.46-153.73-96.46C182.31,63,217.34,34,217.34,34"
                style="fill:none"
            />
        </svg>
        <svg
            id="path10"
            class="fire-path"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 630.54 402.44"
        >
            <path
                d="M269.65,377.92s-62.47-101.17-41.08-150.31,93.08-127.76,87.3-166.49"
                style="fill:none"
            />
        </svg>
        <svg
            id="path11"
            class="fire-path"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 748.55 402.44"
        >
            <path
                d="M382.12,388s-66.34-12.56-119.52-47.56S201.79,221.15,149,196.33C95.84,171.37-1,114.06,2.6,95.88"
                style="fill:none"
            />
        </svg>
        <svg
            id="path12"
            class="fire-path"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 630.54 402.44"
        >
            <path
                d="M284.76,389.39s-8.4-154.69,81.77-132.88c0,0,104.15,35.69,169.31-32.65S628.12,56.18,628.12,56.18"
                style="fill:none"
            />
        </svg>
        <svg
            id="path13"
            class="fire-path"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 630.54 402.44"
        >
            <path
                d="M266.14,391.76s-20.88-144.2-83.56-197.24S25.73,94.07,2.28,42"
                style="fill:none"
            />
        </svg>
    </div>
</template>
<script>
import anime from 'animejs'
import ParticleBase from './FireParticles'
export default {
    data () {
        return {
            animIsRunning: false,
            pathList: [
                { path: '1.svg', key: 'path1' },
                { path: '2.svg', key: 'path2' },
                { path: '3.svg', key: 'path3' },
                { path: '4.svg', key: 'path4' },
                { path: '5.svg', key: 'path5' },
                { path: '6.svg', key: 'path6' },
                { path: '7.svg', key: 'path7' },
                { path: '8.svg', key: 'path8' },
                { path: '9.svg', key: 'path9' },
                { path: '10.svg', key: 'path10' },
                { path: '11.svg', key: 'path11' },
                { path: '12.svg', key: 'path12' },
                { path: '13.svg', key: 'path13' }
            ],
            sparkList: [
                { path: '1.svg', key: 'spark1' },
                { path: '2.svg', key: 'spark2' },
                { path: '3.svg', key: 'spark3' },
                { path: '4.svg', key: 'spark4' }
            ],
            counter: 0
        }
    },
    mounted () {
        this.part = new ParticleBase('test2')
    },
    methods: {
        getUrl (img) {
            return require(`@/main/assets/homepage/fire_sparks/${img}`)
        },
        getRandomInt (min, max) {
            return Math.floor(Math.random() * (max - min) + min)
        },
        particles () {
            this.counter += 1
            if (this.counter >= 20) {
                this.$store.dispatch('unlockAchievement', 'e7b2135eb21f50aabf4c')
            }
            if (!this.animIsRunning) {
                const particleNumber = this.getRandomInt(4, 5)
                const pathListCopy = [...this.pathList]
                const sparkListCopy = [...this.sparkList]
                for (let i = 0; i < particleNumber; ++i) {
                    const chosenPath = pathListCopy.splice(this.getRandomInt(0, pathListCopy.length), 1)[0].key
                    const path = anime.path(`#${chosenPath} path`)
                    const chosenSpark = `#${sparkListCopy.splice(this.getRandomInt(0, sparkListCopy.length), 1)[0].key}`
                    const anim = anime({
                        targets: chosenSpark,
                        translateX: path('x'),
                        translateY: path('y'),
                        opacity: [1, 1, 0],
                        rotate: path('angle'),
                        easing: 'easeOutCubic',
                        duration: 1700
                    })
                    if (i === particleNumber - 1) {
                        this.animIsRunning = true
                        anim.finished.then(_ => {
                            this.animIsRunning = false
                        })
                    }
                }
            }
            const flask = document.getElementById('flask').getBoundingClientRect()
            this.part.animateParticles(flask.left + 100, flask.top + 110)
        },
        shake () {
            anime({
                targets: '#flask',
                translateX: [
                    { value: 7 },
                    { value: -7 },
                    { value: 7 },
                    { value: -7 },
                    { value: 0 }
                ],
                rotate: [
                    { value: 2 },
                    { value: -2 },
                    { value: 2 },
                    { value: -2 },
                    { value: 0 }
                ],
                duration: 400,
                easing: 'easeInSine'
            })
            this.particles()
        }
    }
}
</script>

<style scoped>
#flask {
    cursor: pointer;
}
#flask,
.fire-path,
.firespark {
    position: absolute;
    pointer-events: none;
}
.fire-path,
#path1 {
    height: 300px;
    bottom: -100px;
    left: 50%;
    margin-left: -205px;
}
.firespark {
    bottom: 200px;
    margin-left: -205px;
    left: 50%;
}
@media (max-width: 710px) {
    .fire-path {
        display: none;
    }
}
</style>
