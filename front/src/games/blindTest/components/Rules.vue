<template>
    <div>
        <h3>
            Chose one or multiple blind tests in the settings. Songs will be played, and each time you recognize the song you gain points.
        </h3>
        <br>
        <v-card outlined>
            <v-card-title>
                Points calculation for each good answer:
            </v-card-title>
            <div
                style='text-align: left'
                class='pl-4 pb-4'
            >
                <ul>
                    <li>+10</li>
                    <li>+(seconds remaining / 3)</li>
                    <li>+5 if first to find</li>
                    <li>-5 if last to find</li>
                </ul>
            </div>

        </v-card>
        <div class=' py-5'>
        </div>
        <v-card outlined>
            <v-card-title>
                Blind test creation:
            </v-card-title>
            <div
                style='text-align: left'
                class='pl-4 pb-4'
            >
                <ul>
                    <li>Each song must be Youtube urls</li>
                    <li>There must be a unique name and at least 10 songs / audio sample.</li>
                    <li>Once sent it will be reviewed for quality and if accepted, will be added to the list for everyone to use.</li>
                    <li>We will accept almost everything, it does not have to be music it can be voice, sounds, instruments etc...</li>
                </ul>
            </div>
        </v-card>
    </div>
</template>

<script>
export default {

}
</script>

<style scoped>
</style>
