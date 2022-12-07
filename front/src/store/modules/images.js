const state = {
    blindTest: 'games/blindTest/assets/main_image',
    mentalist: 'games/mentalist/assets/double-agent'

}
const getters = {
    getImage (state) {
        return (gameName) => {
            return state[gameName]
        }
    },
    getAllGames (state) {
        return Object.keys(state)
    }
}
export default {
    state,
    getters
}
