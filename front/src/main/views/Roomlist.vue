<template>
    <div id="game">
        <div id="innergame">
            <img
                src="@/main/assets/roomlist/table.svg"
                id="table"
                ondragstart="return false;"
            />

            <img
                src="@/main/assets/roomlist/paintings.svg"
                id="paintings"
                ondragstart="return false;"
            />
            <img
                src="@/main/assets/roomlist/cracks.svg"
                id="cracks1"
                ondragstart="return false;"
            />
            <img
                src="@/main/assets/roomlist/cracks.svg"
                id="cracks2"
                ondragstart="return false;"
            />
            <img
                src="@/main/assets/roomlist/shelf.svg"
                id="roomlist_shelf"
                ondragstart="return false;"
            />
            <clock id="clock" />
            <rules
                id="rules"
                :gameTitle='game'
            />
            <lamp id="lamp" />
            <screen
                id="screen"
                :gameTitle="game"
            />
        </div>
    </div>
</template>

<script>
import rules from '@/main/components/roomlist/Rules'
import clock from '@/main/components/roomlist/Clock'
import lamp from '@/main/components/roomlist/Lamp'
import screen from '@/main/components/roomlist/Screen'
export default {
    components: { clock, lamp, screen, rules },
    name: 'Roomlist',
    data () {
        return {
            game: this.$route.params.game,
            unsubscribe: _ => { }
        }
    },
    mounted () {
        this.unsubscribe = this.$store.subscribe(function (mutation, state) {
            if (mutation.type === 'wsMsg') {
                // manage websocket message
            }
        })
    },
    destroyed () {
        this.unsubscribe()
    }
}
</script>

<style scoped>
@media (min-width: 1000px) {
    #roomlist_shelf {
        position: absolute;
        left: 80vw;
        width: 12vw;
        bottom: 0vw;
    }
    #lamp {
        position: absolute;
        left: 5vw;
        bottom: 23.6vw;
    }
    #clock {
        position: absolute;
        left: 10vw;
        top: 22vh;
    }
    #table {
        position: absolute;
        width: 50vw;
        left: 25vw;
        bottom: 0;
    }
    #cracks1 {
        position: absolute;
        width: 7vw;
        left: 7vw;
        top: 6vh;
    }
    #cracks2 {
        position: absolute;
        width: 7vw;
        right: 7vw;
        top: 50vh;
    }
    #paintings {
        position: absolute;
        width: 13vw;
        top: 15vh;
        right: 5vw;
    }
    #rules {
        position: absolute;
        width: 6vw;
        bottom: calc(11.2vw / 1.3368421052);
        right: 10vw;
    }
    #screen {
        height: calc(100% - 15vw);
        width: 60vw;
        position: absolute;
        left: 20vw;
        /* background: #ff000030; */
    }
}
@media (max-width: 999px) {
    #lamp,
    #clock,
    #cracks1,
    #cracks2,
    #paintings,
    #roomlist_shelf,
    #rules,
    #table {
        display: none;
    }
    #screen {
        height: calc(100% - 15vw);
        width: 100vw;
        position: absolute;
        top: 0;
        /* background: #ff000030; */
    }
}
#innergame {
    position: absolute;
    width: 100%;
    height: calc(100vh - 48px);
    margin-top: 48px;
}
#game {
    background: rgb(48, 47, 89);
    background: radial-gradient(
        circle,
        rgba(48, 47, 89, 1) 0%,
        rgba(4, 5, 18, 1) 100%
    );
    background-origin: padding-box;
    height: 100vh;
}
</style>
