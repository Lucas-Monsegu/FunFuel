import Vue from 'vue'
import Vuex from 'vuex'
import anim from './modules/anim'
import commands from './modules/commands'
import room from './modules/room'
import snack from './modules/snack'
import players from './modules/players'
import rooms from './modules/rooms'
import userData from './modules/userData'
import achievements from './modules/achievements'
import images from './modules/images'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
    modules: {
        anim,
        commands,
        room,
        snack,
        players,
        rooms,
        userData,
        achievements,
        images
    },
    strict: debug
})
