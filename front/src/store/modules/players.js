const state = {
    names: [],
    players: [],
    playersData: {},
    publicId: null,
    sessionId: localStorage.getItem('sessionId'),
    masterId: null
}

const mutations = {
    setNames (state, names) {
        state.names = names
    },
    setPlayers (state, players) {
        state.players = players
    },
    setTeam (state, { team, index }) {
        const copy = [...state.players]
        copy[index] = team
        state.players = copy
    },
    setPlayersData (state, playersData) {
        for (const id in playersData) {
            if (playersData[id].userData.avatar) { playersData[id].userData.avatar = playersData[id].userData.avatar.charCodeAt() }
            if (playersData[id].userData.pattern) { playersData[id].userData.pattern = playersData[id].userData.pattern.charCodeAt() }
        }
        state.playersData = playersData
    },
    setPublicId (state, id) {
        state.publicId = id
    },
    setSessionId (state, id) {
        state.sessionId = id
        localStorage.setItem('sessionId', id)
    },
    setMasterId (state, masterId) {
        state.masterId = masterId
    }
}

const actions = {
    resetPlayers ({ commit }) {
        commit('setNames', [])
        commit('setPlayers', [])
        commit('setPlayersData', {})
        commit('setPublicId', null)
        commit('setMasterId', null)
    }
}

const getters = {
    names (state) {
        return state.names
    },
    players (state) {
        return state.players
    },
    playersData (state) {
        return state.playersData
    },
    publicId (state) {
        return state.publicId
    },
    sessionId (state) {
        return state.sessionId
    },
    masterId (state) {
        return state.masterId
    },
    isMaster (state) {
        return !!(state.publicId && state.publicId === state.masterId)
    },
    isObs (state) {
        return !state.players.some(el => { return el.includes(state.publicId) })
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
