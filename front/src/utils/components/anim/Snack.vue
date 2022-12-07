<template>
    <transition name="snack">
        <v-snackbar
            id="snack"
            v-if="active"
            v-model="active"
            bottom
            right
            :color="snack.color || 'success'"
            :timeout="snack.timeout || 3000"
            @input="close"
            @click="close"
        >
            {{ snack.text || 'You found a bug, congrats!' }}
        </v-snackbar>
    </transition>
</template>

<script>
export default {
    data () {
        return {
            active: false
        }
    },
    computed: {
        snack () {
            return this.$store.getters.snack
        }
    },
    watch: {
        snack (b) {
            this.active = !!b
        }
    },
    methods: {
        close () {
            this.active = false
            setTimeout(_ => {
                this.$store.commit('popSnack')
            }, 150)
        }
    }
}
</script>

<style scoped>
#snack {
    cursor: pointer;
}
.snack-enter-active {
    transition: all 0.6s cubic-bezier(1, 0, 0, 1);
}
.snack-leave-active {
    transition: all 0.3s linear;
}
.snack-enter,
.snack-leave-to {
    transform: translateY(80px);
}
</style>
