<template>
    <v-hover>
        <template v-slot:default="{ hover }">
            <v-card
                class="mx-auto"
                max-width="344"
            >
                <div @click="clickGame">
                    <v-img
                        :src="img"
                        class="white--text align-end clickPointer"
                        height="200px"
                        aspect-ratio="2"
                        @click="clickGame"
                        v-ripple
                    />
                </div>
                <v-card-title
                    class="justify-center text-capitalize mont"
                    v-text="gameName"
                ></v-card-title>

                <v-fade-transition>
                    <v-overlay
                        v-if="hover"
                        absolute
                        opacity="0.30"
                        color="#FF8028"
                        class="noEvent"
                    >
                        <v-btn
                            class="createButton"
                            @click="clickCreateRoom"
                            :loading="loading"
                        >Create room</v-btn>

                    </v-overlay>

                </v-fade-transition>
            </v-card>
        </template>
    </v-hover>

</template>

<script>
export default {
    props: {
        gameName: {
            type: String,
            required: true
        }
    },
    data () {
        return {
            loading: false
        }
    },
    methods: {
        clickGame () {
            this.$router.push(`/${this.gameName}`)
        },
        clickCreateRoom () {
            this.loading = true
            const game = this.gameName
            if (new Date().getHours() === 1) {
                this.$store.dispatch('unlockAchievement', '1efsadglkpasgjnoiwb')
            }
            this.$store.dispatch('createRoom', {
                game: game,
                isPublic: true,
                name: 'my room',
                password: '',
                maxPlayers: 8
            }).then(token => {
                this.loading = false
                if (token) {
                    this.$router.push(`${game}/${token}`)
                }
            })
        }
    },
    computed: {
        img () {
            const img = this.$store.getters.getImage(this.gameName)
            return require(`@/${img}.svg`)
        }
    }
}
</script>

<style scoped>
.mont {
    font-family: "Mont";
    font-size: 25px;
}
.createButton {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: all;
}
.idk {
    position: absolute;
    width: 100%;
    height: 100%;
}
#textCenter {
    text-align: center;
}
.clickPointer {
    cursor: pointer;
}
.noEvent {
    pointer-events: none;
}
</style>
