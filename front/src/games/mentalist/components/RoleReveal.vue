<template>
    <v-fade-transition>
        <div
            id="rolereveal"
            v-show="display"
        >
            <div v-if="endAnim">
                Winners: {{ winners }}
            </div>
            <img
                :src="roleImg"
                id='roleimg'
                draggable="false"
                ondragstart="return false;"
            />
            <div
                class="roletext"
                v-show="!endAnim"
            >
                <b>{{name}}</b> was a
                <span
                    id="rolespan"
                    :style="getStyleText()"
                >
                    {{ roles[role] }}
                </span>
            </div>
            <div
                class='roletext'
                v-show="endAnim"
            >
                <span
                    id="rolespan"
                    :style="getStyleText()"
                >
                    {{ roles[role] }}s
                </span>
                Win
            </div>
        </div>
    </v-fade-transition>
</template>

<script>
import anime from 'animejs'
export default {
    name: 'reveal',
    data () {
        return {
            roles: ['Citizen', 'Mentalist', 'Double Agent'],
            colors: ['#f2cb6b', '#2f4d85', '#b54a56'],
            display: false,
            role: 0,
            name: '',
            endAnim: false,
            winner: undefined
        }
    },
    computed: {
        roleImg () {
            return require(`@/games/mentalist/assets/${['citizen', 'mentalist', 'double-agent'][this.role]}.svg`)
        }
    },
    methods: {
        getStyleText () {
            const col = this.role === 0 ? 'black' : 'white'
            return {
                color: this.colors[this.role],
                textShadow: `-1px 0 ${col}, 0 1px ${col}, 1px 0 ${col}, 0 -1px ${col}`
            }
        },
        animate (name, role, endAnim = false, winners = undefined) {
            this.endAnim = endAnim
            this.winners = winners
            this.name = name
            this.role = role
            const timeleft = endAnim ? 10000 : 1200
            setTimeout(() => {
                this.display = true
                anime({
                    targets: '#roleimg',
                    scale: [1.5, 1],
                    duration: 500,
                    easing: 'easeOutCubic'
                }).finished.then(_ => {
                    anime({
                        targets: '.roletext',
                        opacity: [
                            { value: 1, duration: 300 },
                            { value: 0, delay: timeleft, duration: 1 }
                        ],
                        easing: 'easeOutCubic'
                    }).finished.then(_ => {
                        this.display = false
                    })
                })
            })
        }
    }

}
</script>

<style scoped>
#rolereveal {
    font-size: 35px;
    text-align: center;
}
#rolespan {
    font-family: "Mont";
}
.roletext {
    opacity: 0;
}
</style>
