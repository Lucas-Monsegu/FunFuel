<template>
    <div
        id="card"
        v-ripple
        @click="$emit('click')"
    >
        <svg
            id="bottom"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 369.33 67.62"
        >
            <g id="path13260">
                <rect
                    width="369.33"
                    height="67.62"
                    rx="2"
                    ry="2"
                    style="fill:#020202"
                />
            </g>
        </svg>
        <svg
            id="middle"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 369.33 67.62"
        >
            <path
                id="path13260"
                d="M4.1,3.67H365.24V64H4.1Z"
                :style="`fill:${chosenDark}`"
            />
        </svg>
        <svg
            id="top"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 369.33 67.62"
        >
            <path
                id="path16559"
                d="M8.41,7.31H360.92v53H8.41Z"
                :style="`fill:${chosenLight}`"
            />
        </svg>
        <img
            src="@/main/assets/roomlist/room_card/lock.svg"
            id="lock"
            ondragstart="return false;"
            v-if="isPrivate"
        />
        <img
            :src="`https://funfuelbucket.s3.amazonaws.com/avatar/${avatar}.svg`"
            id="avatar"
            ondragstart="return false;"
        />
        <div id="outname">
            <div id="name">
                {{name}}
            </div>
        </div>
        <div id="outnumber">
            <div id="number">
                <sup>{{players}}</sup>&frasl;<sub>{{maxPlayers}}</sub>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        name: {
            type: String
        },
        colorIndex: {
            type: Number,
            default: 0
        },
        isPrivate: {
            type: Boolean,
            default: false
        },
        players: {
            type: Number,
            default: 0
        },
        maxPlayers: {
            type: Number,
            default: 8
        },
        avatar: {
            type: Number,
            default: 0
        }
    },
    data () {
        const colorsLight = ['#1abc9c', '#2ecc71', '#3498db', '#9b59b6', '#34495e', '#f1c40f', '#e67e22', '#e74c3c']
        const colorsDark = ['#16a085', '#27ae60', '#2980b9', '#8e44ad', '#2c3e50', '#f39c12', '#d35400', '#c0392b']
        return {
            chosenLight: colorsLight[this.colorIndex],
            chosenDark: colorsDark[this.colorIndex]
        }
    }
}

</script>

<style scoped>
#card {
    display: inline-block;
    cursor: pointer;
    transition: box-shadow;
    position: relative;
    width: 40%;
    height: 16.1%;
    margin: 0 2.5% 2% 2.5%;
}
#bottom,
#middle,
#top,
#lock,
#avatar,
#outname,
#outnumber {
    position: absolute;
}
#bottom,
#middle,
#top {
    width: 100%;
    height: 100%;
}
#lock {
    width: 14px;
    left: 50%;
    bottom: -15.5px;
    margin-left: -7px;
}
#avatar {
    height: 80%;
    border-radius: 10px;
    left: 2.5%;
    top: 10%;
}
#outname {
    left: 19%;
    height: 100%;
    width: 65%;
    text-align: center;
}
#name {
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
    position: absolute;
    overflow: hidden;
    text-overflow: ellipsis;
    font-family: "Mont";
    white-space: nowrap;
}
#outnumber {
    display: table;
    right: 2.5%;
    height: 100%;
    width: 14%;
    text-align: center;
}
#number {
    position: static;
    display: table-cell;
    vertical-align: middle;
}
</style>
