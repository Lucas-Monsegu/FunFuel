const state = {
    animgolf: 'finished',
    animmeow: 'finished',
    animshuffle: 'finished',
    animlock: 'finished',
    animachievement: 'finished',
    animspellingfinish: 'finished',
    animlevelup: 'finished',
    animclickable: 'finished',
    animbubblediscord: 'finished',
    animbubbletwitter: 'finished'
}

// play, load, pause, finished
function checkMutation (state, command) {
    switch (command) {
        case 'play':
            return state === 'finished' || state === 'pause' || state === 'load'
        case 'pause':
            return state === 'play'
        case 'load':
            return state === 'finished'
        case 'finished':
            return true
    }
}

const mutations = {
    animbubbletwitter (state, b) {
        if (checkMutation(state.animclickable, b)) {
            state.animbubbletwitter = b
        }
    },
    animbubblediscord (state, b) {
        if (checkMutation(state.animclickable, b)) {
            state.animbubblediscord = b
        }
    },
    animclickable (state, b) {
        if (checkMutation(state.animclickable, b)) {
            state.animclickable = b
        }
    },
    animlevelup (state, b) {
        if (checkMutation(state.animgolf, b)) {
            state.animlevelup = b
        }
    },
    animgolf (state, b) {
        if (checkMutation(state.animgolf, b)) {
            state.animgolf = b
        }
    },
    animmeow (state, b) {
        if (checkMutation(state.animmeow, b)) {
            state.animmeow = b
        }
    },
    animshuffle (state, b) {
        if (checkMutation(state.animshuffle, b)) {
            state.animshuffle = b
        }
    },
    animlock (state, b) {
        if (checkMutation(state.animlock, b)) {
            state.animlock = b
        }
    },
    animachievement (state, b) {
        if (checkMutation(state.animachievement, b)) {
            state.animachievement = b
        }
    },
    animspellingfinish (state, b) {
        if (checkMutation(state.animspellingfinish, b)) {
            state.animspellingfinish = b
        }
    }
}

const actions = {}

const getters = {
    animbubbletwitter (state) {
        return state.animbubbletwitter
    },
    animbubblediscord (state) {
        return state.animbubblediscord
    },
    animclickable (state) {
        return state.animclickable
    },
    animlevelup (state) {
        return state.animlevelup
    },
    animgolf (state) {
        return state.animgolf
    },
    animmeow (state) {
        return state.animmeow
    },
    animshuffle (state) {
        return state.animshuffle
    },
    animlock (state) {
        return state.animlock
    },
    animachievement (state) {
        return state.animachievement
    },
    animspellingfinish (state) {
        return state.animspellingfinish
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
