<template>
    <div
        class="profile"
        v-if="connectedState === 2"
        @click="toProfile"
    >
        <div id="username">
            {{username}}
        </div>
        <div id="avatar">
            <v-badge
                overlap
                bottom
                color="#eb2f06"
                :content="level"
            >
                <v-avatar size=40>
                    <img :src="`https://funfuelbucket.s3.amazonaws.com/avatar/${avatar}.svg`" />
                </v-avatar>
            </v-badge>
        </div>
    </div>
    <div
        class="profile"
        v-else
    >
        <div id="usernameSkeletonOut">
            <v-skeleton-loader
                id="usernameSkeleton"
                type="text"
            ></v-skeleton-loader>
        </div>
        <v-avatar size=40>
            <v-skeleton-loader
                id="avatar"
                type="avatar"
            ></v-skeleton-loader>
        </v-avatar>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    computed: {
        ...mapGetters(['level', 'avatar', 'username', 'connectedState', 'userPublicId'])
    },
    methods: {
        toProfile () {
            const path = `/profile/${this.userPublicId}`
            if (this.$route.path !== path) { this.$router.push(path) }
        }
    }
}
</script>

<style scoped>
.profile {
    cursor: pointer;
    align-items: center;
    position: relative;
}
#username,
#avatar,
#usernameSkeletonOut {
    display: inline-block;
}
#username {
    margin-right: 0.4em;
    font-family: "Mont";
}
#usernameSkeletonOut {
    position: relative;
    margin-right: 0.4em;
    width: 6em;
    height: 0px;
}
#usernameSkeleton {
    width: 100%;
    position: absolute;
    transform: translateY(-50%);
}
#avatar {
    padding-right: 0.6em;
}
</style>
