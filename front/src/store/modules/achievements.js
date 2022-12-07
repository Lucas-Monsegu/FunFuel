import axios from 'axios'

const state = {
    achievementUnlockedId: 0
}

const mutations = {
    achievementUnlocked (state, val) {
        state.achievementUnlockedId = val
    }
}

const actions = {
    unlockAchievement ({ commit, getters }, token) {
        const tokens = {
            '7590487579a0d4b120ce': String.fromCharCode(1001),
            '7gqwedqwrqweewqgq': String.fromCharCode(1002),
            '010ec5967322b5a0557a': String.fromCharCode(1003),
            ca330cf29b774e2f3f84: String.fromCharCode(2000),
            e7b2135eb21f50aabf4c: String.fromCharCode(2001),
            '1ef068a272da5199822b': String.fromCharCode(2002),
            '1efsadglkpasgjnoiwb': String.fromCharCode(3000)
        }
        if (getters.connectedState !== 2 || getters.unlockedAchievements.includes(tokens[token])) {
            return
        }
        axios({
            method: 'POST',
            url: `${process.env.VUE_APP_MAINURL}/achievement`,
            withCredentials: true,
            data: {
                achievementId: token
            }
        })
            .then(res => {
                commit('animachievement', 'play')
                commit('achievementUnlocked', tokens[token].charCodeAt(0))
            })
            .catch(_ => {

            })
    }
}

const getters = {
    achievementUnlockedId (state) {
        return state.achievementUnlockedId
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
