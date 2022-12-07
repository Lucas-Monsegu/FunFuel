import axios from 'axios'

const state = {
    data: null,
    connectedState: 0
}

const mutations = {
    setData (state, data) {
        state.data = data
    },
    setConnectedState (state, connectedState) {
        state.connectedState = connectedState
    },
    setAvatar (state, avatar) {
        state.data.avatar = avatar
    },
    setPattern (state, pattern) {
        state.data.pattern = pattern
    },
    setSync (state, syncName) {
        state.data.syncName = syncName
        if (syncName) { state.data.username = state.data.apiName }
    },
    setUsername (state, username) {
        state.data.username = username
    },
    setAchievement (state, achievement) {
        state.data.achievement = achievement
    }
}

const actions = {
    getData ({ commit }) {
        return axios.get(`${process.env.VUE_APP_MAINURL}/user`, {
            withCredentials: true
        })
            .then(res => {
                const unlockables = res.data.unlockables
                delete res.data.unlockables
                res.data = { ...res.data, ...unlockables }
                res.data.avatar = res.data?.avatar?.charCodeAt()
                res.data.pattern = res.data?.pattern?.charCodeAt()
                res.data.achievement = res.data?.achievement?.charCodeAt()
                commit('setData', res.data)
                commit('setConnectedState', 2)
            })
            .catch(_ => {
                commit('setData', null)
                commit('setConnectedState', 1)
            })
    },
    saveProfile ({ state }) {
        return axios({
            method: 'POST',
            url: `${process.env.VUE_APP_MAINURL}/user`,
            withCredentials: true,
            data: {
                user: {
                    username: state.data.username,
                    avatar: String.fromCharCode(state.data.avatar),
                    syncName: state.data.syncName,
                    pattern: String.fromCharCode(state.data.pattern),
                    achievement: String.fromCharCode(state.data.achievement)
                }
            }
        })
    },
    logout ({ commit }) {
        axios.get(`${process.env.VUE_APP_MAINURL}/auth/logout`, {
            withCredentials: true
        })
            .then(res => {
                commit('setData', null)
                commit('setConnectedState', 1)
                commit('addSnack', {
                    text: 'Successfully logged out'
                })
            })
            .catch(err => {
                if (err.response.status === 401) {
                    commit('addSnack', {
                        text: 'Already logged out',
                        color: 'orange'
                    })
                } else {
                    commit('addSnack', {
                        text: 'Unexpected error while logging out',
                        color: 'red'
                    })
                }
            })
    }
}

const getters = {
    /**
     * @returns {string}
     */
    username (state) {
        return state.data.username
    },
    /**
     * @returns {number}
     */
    level (state) {
        return state.data.level
    },
    /**
     * @returns {string}
     */
    avatar (state) {
        return state.data.avatar
    },
    pattern (state) {
        return state.data.pattern
    },
    achievement (state) {
        return state.data.achievement
    },
    unlockedAchievements (state) {
        return state.data.uAchievement
    },
    /**
     * @returns {number}
     */
    apiType (state) {
        return state.data.apiType
    },
    syncName (state) {
        return state.data.syncName
    },
    /**
     * @returns {number}
     */
    xp (state) {
        return state.data.xp
    },
    /**
     * @returns {Date}
     */
    lastWonGame (state) {
        return state.data.lastWonGame
    },
    connectedState (state) {
        return state.connectedState
    },
    userPublicId (state) {
        return state.data?.publicId
    }
}
export default {
    state,
    mutations,
    actions,
    getters
}
