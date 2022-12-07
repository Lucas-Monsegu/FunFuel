import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/main/views/Home.vue'
import Roomlist from '@/main/views/Roomlist.vue'
import Room from '@/main/views/Room.vue'
import Profile from '@/main/views/Profile.vue'
import Games from '@/main/views/Games.vue'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/about',
        name: 'About',
        component: () => import(/* webpackChunkName: "about" */ '@/main/views/About.vue')
    },
    {
        path: '/games',
        name: 'Games',
        component: Games
    },
    {
        path: '/profile/:id',
        name: 'Profile',
        component: Profile
    },
    {
        path: '/:game/:token',
        name: 'Room',
        component: Room
    },
    {
        path: '/:game',
        name: 'Roomlist',
        component: Roomlist
    }
]

const scrollBehavior = function (to, from, savedPosition) {
    if (savedPosition) {
        return savedPosition
    } else {
        return { x: 0, y: 0 }
    }
}

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    scrollBehavior,
    routes
})

export default router
