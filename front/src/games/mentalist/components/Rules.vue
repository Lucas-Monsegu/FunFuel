<template>
    <v-container>
        <v-col>
            <v-row>
                <div id='toptext'>
                    Everyone gets a word at the start of the game. You'll have to guess your own role in order to win.
                </div>
            </v-row>
            <v-row>
                <v-col cols=6>
                    <v-card
                        outlined
                        width="100%"
                    >
                        <v-row no-gutters>
                            <v-col cols=4>
                                <img
                                    src="@/games/mentalist/assets/citizen.svg"
                                    class='roleimg'
                                    draggable="false"
                                    ondragstart="return false;"
                                />
                            </v-col>
                            <v-col cols=8>
                                <div
                                    style='position: absolute; text-align: left;top:50%; transform: translateY(-50%);'
                                    class="pr-1"
                                >
                                    All <span class="citizenText">citizens</span> get the same word, their objective is to eliminate <span class="doubleagentText">double-agents</span> and <span class="mentalistText">mentalists</span>
                                </div>
                            </v-col>
                        </v-row>
                    </v-card>
                </v-col>
                <v-col cols=6>
                    <v-card
                        outlined
                        width="100%"
                    >
                        <v-row no-gutters>
                            <v-col cols=4>
                                <img
                                    src="@/games/mentalist/assets/double-agent.svg"
                                    class='roleimg'
                                    draggable="false"
                                    ondragstart="return false;"
                                />
                            </v-col>
                            <v-col cols=8>
                                <div
                                    style='position: absolute; text-align: left;top:50%; transform: translateY(-50%);'
                                    class="pr-1"
                                >
                                    All <span class="doubleagentText">double-agents</span> get an other word that is close to the <span class="citizenText">citizen</span>'s word. To win they must eliminate all <span class="citizenText">citizens</span>
                                </div>
                            </v-col>
                        </v-row>
                    </v-card>
                </v-col>
            </v-row>
            <v-row>
                <v-card
                    outlined
                    width="100%"
                >
                    <img
                        src="@/games/mentalist/assets/mentalist.svg"
                        class='mentalistImg'
                        draggable="false"
                        ondragstart="return false;"
                    />
                    <div>
                        Does not get a word. To win he must guess the word of the <span class="citizenText">citizens </span> or eliminate everyone else
                    </div>
                </v-card>
            </v-row>
            <v-row
                class='pt-5'
                style='text-align: left;font-size: 20px;'
            >
                At the start of each round everyone describe the word that he got with an other word.
                When everyone has described his word everyone can vote for someone and that player will be eliminated.
            </v-row>
        </v-col>
    </v-container>
</template>

<script>
export default {

}
</script>

<style scoped>
.roleimg {
    width: 70%;
}
.mentalistImg {
    width: 17vmin;
}
.citizenText {
    font-weight: 500;
    color: #f2cb6b;
}
.doubleagentText {
    font-weight: 500;
    color: #b54a56;
}
.mentalistText {
    font-weight: 500;
    color: #2f4d85;
}
#toptext {
    font-size: 25px;
    text-align: center;
}
</style>
