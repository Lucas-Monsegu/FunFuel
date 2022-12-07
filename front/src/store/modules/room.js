import axios from 'axios'
import router from '../../router'

const state = {
    token: null,
    maxPlayers: null,
    numberPlayers: null,
    roomName: null
}

const mutations = {
    setToken (state, token) {
        state.token = token
    },
    setMaxPlayers (state, max) {
        state.maxPlayers = max
    },
    setNumberPlayers (state, num) {
        state.numberPlayers = num
    },
    setRoomName (state, name) {
        state.roomName = name
    }
}

const actions = {
    async createRoom ({ commit, dispatch }, { game, isPublic, name, password, maxPlayers }) {
        try {
            const path = (await axios.get(`${process.env.VUE_APP_DISPATCHURL}/get-balanced-server?game=${game}`)).data.path
            const token = (await axios.post(`${process.env.VUE_APP_HTTP}${path}/create-room`, {
                game, isPublic, name, password, maxPlayers
            })).data.token
            dispatch('unlockAchievement', '7590487579a0d4b120ce')
            const el = document.createElement('textarea')
            el.value = `${process.env.VUE_APP_FRONTURL}/${game}/${token}`
            document.body.appendChild(el)
            el.select()
            document.execCommand('copy')
            document.body.removeChild(el)
            commit('addSnack', { text: 'Link copied to clipboard 🔗' })
            return token
        } catch (error) {
            const status = error.response.status
            if (status === 503) {
                commit('addSnack', { text: 'Servers are full please try again later', color: 'error' })
            } else {
                commit('addSnack', { text: 'Unexpected error, we will try to fix it', color: 'error' })
            }
        }
    },
    async joinRoom ({ commit, dispatch }, { token, game }) {
        try {
            const path = (await axios.get(`${process.env.VUE_APP_DISPATCHURL}/connect?token=${token}`)).data.path
            dispatch('wsConnect', {
                path: `${process.env.VUE_APP_WS}${path}`,
                token,
                game
            })
        } catch {
            commit('addSnack', {
                text: 'This room no longer exists.',
                color: 'red'
            })
            router.push(`/${game}`)
        }
    },
    resetRoom ({ commit }) {
        commit('setToken', null)
        commit('setMaxPlayers', null)
        commit('setNumberPlayers', null)
        commit('setRoomName', null)
    },
    leaveRoom ({ dispatch }) {
        dispatch('wsDisconnect')
        dispatch('resetPlayers')
        dispatch('resetRoom')
    }
}

const getters = {
    token (state) {
        return state.token
    },
    maxPlayers (state) {
        return state.maxPlayers
    },
    numberPlayers (state) {
        return state.numberPlayers
    },
    roomName (state) {
        return state.roomName
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
