<template>
    <div>
        <v-checkbox
            v-model="ambassadors"
            class="mx-2"
            label="Ambassadors"
            color="#3498db"
            hide-details
        ></v-checkbox>
        <v-slider
            v-model="secondsPerTurn"
            thumb-label
            label="seconds/turn"
            min=5
            max=60
            color="#3498db"
            hide-details
        ></v-slider>
    </div>
</template>

<script>
export default {
    data () {
        return {
            ambassadors: false,
            secondsPerTurn: 30
        }
    }
}
</script>

<style scoped>
</style>
