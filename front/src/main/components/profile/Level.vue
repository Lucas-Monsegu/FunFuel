<template>
    <div
        id="lvl"
        :style="getLvlStyle()"
        class="text-center"
    >
        <span id="text">
            {{ level }}
        </span>
    </div>
</template>

<script>
export default {
    props: {
        level: {
            type: Number,
            default: 0
        }
    },
    data () {
        return {
            color: ['#1ABC9C', '#38ada9', '#60a3bc', '#3c6382', '#4a69bd', '#1e3799', '#e55039', '#eb2f06', '#f6b93b', '#fa983a'][Math.floor(this.level / 10) % 10],
            formIndex: Math.floor(this.level / 10) % 10
        }
    },
    methods: {
        getLvlStyle () {
            const t = `url(${require(`../../assets/profile/level/${this.formIndex}.svg`)}) no-repeat 50% 50%`
            return {
                position: 'absolute',
                textAlign: 'center',
                '-webkit-mask': t,
                mask: t,
                '-webkit-mask-size': 'contain',
                maskSize: 'contain',
                backgroundColor: '#1abc9c'
            }
        }
    }
}
</script>

<style scoped >
#levelbg {
    width: 100%;
    height: 100%;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}
#text {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -56%);
    position: absolute;
    font-family: "Mont";
}
</style>
