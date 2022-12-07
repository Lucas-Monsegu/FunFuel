const state = {
    rooms: []
}

const mutations = {
    setRooms (state, rooms) {
        for (const room of rooms) {
            room.avatarUrl = room.avatarUrl.charCodeAt()
        }
        state.rooms = rooms
    }
}

const actions = {
}

const getters = {
    rooms (state) {
        return state.rooms
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
