const state = {
    snacks: []
}

const mutations = {
    addSnack (state, snack) {
        state.snacks.unshift(snack)
    },
    popSnack (state) {
        state.snacks.pop()
    }
}

const actions = {
}

const getters = {
    snack (state) {
        return state.snacks[state.snacks.length - 1]
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
