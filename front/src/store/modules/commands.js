const state = {
    ws: null
}

const mutations = {
    setWs (state, ws) {
        state.ws = ws
    },
    wsMsg () { } // subscription point
}

const actions = {
    wsConnect ({ dispatch, commit, getters }, { path, token, game }) {
        if (path && token) {
            dispatch('wsDisconnect')
            const session = getters.sessionId || ''
            const ws = new WebSocket(`${path}/${token}/${session}`)
            ws.onopen = _ => {
                commit('setWs', ws)
                ws.send(JSON.stringify({ command: 'connect' }))
            }
            ws.onmessage = (msg) => {
                commit('wsMsg', msg)
            }
        }
    },
    wsDisconnect ({ commit, state }) {
        if (state.ws) {
            state.ws.close()
            commit('setWs', null)
        }
    },
    wsJoinTeam ({ state }, newTeam) {
        if (state.ws) {
            state.ws.send(JSON.stringify({ command: 'ChangePlayerTeam', newTeam: newTeam }))
        }
    },
    GetStateOfTheGame ({ state }) {
        if (state.ws) {
            state.ws.send(JSON.stringify({ command: 'GetStateOfTheGame' }))
        }
    },
    Join ({ state }) {
        if (state.ws) {
            state.ws.send(JSON.stringify({ command: 'Join' }))
        }
    },
    RandomizeTeams ({ state }) {
        if (state.ws) {
            state.ws.send(JSON.stringify({ command: 'RandomizeTeams' }))
        }
    },
    sendPassword ({ state }, password) {
        if (state.ws) {
            state.ws.send(JSON.stringify({ command: 'CheckPassword', password: password }))
        }
    },
    kick ({ state }, playerId) {
        if (state.ws) {
            state.ws.send(JSON.stringify({ command: 'Kick', playerId: playerId }))
        }
    },
    play ({ state }) {
        if (state.ws) {
            state.ws.send(JSON.stringify({ command: 'Play' }))
        }
    },
    ChangePlayerTeamAdmin ({ state }, { playerId, newPosition, newTeam }) {
        if (state.ws) {
            state.ws.send(JSON.stringify({
                command: 'ChangePlayerTeamAdmin',
                playerId,
                newPosition,
                newTeam
            }))
        }
    }
}

const getters = {
    ws (state) {
        return state.ws
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
