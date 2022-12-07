<template>
    <div id="keys">
        <svg
            id="a"
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 81.5 53.19"
        >
            <g id="g4288">
                <rect
                    id="aback"
                    x="0.75"
                    y="28.94"
                    width="23.53"
                    height="23.49"
                    style="fill:#f2f2f2;stroke:#000;stroke-linecap:round;stroke-linejoin:round;stroke-width:1.5px"
                />
                <g id="text5539">
                    <path
                        id="path4286"
                        d="M16.18,44.74H15l-.79-2.26h-3.5l-.8,2.26H8.85l3-8.1h1.43Zm-2.27-3.18-1.42-4-1.43,4Z"
                    />
                </g>
            </g>
        </svg>
        <svg
            id="w"
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 81.5 53.19"
        >
            <g id="g4288">
                <rect
                    id="wback"
                    x="21.4"
                    y="0.75"
                    width="23.53"
                    height="23.49"
                    style="fill:#f2f2f2;stroke:#000;stroke-linecap:round;stroke-linejoin:round;stroke-width:1.5px"
                />
                <g id="text5551">
                    <path
                        id="path4277"
                        d="M38.17,8.45l-2.11,8.1H34.85l-1.7-6.73-1.67,6.73H30.3l-2.15-8.1h1.11L31,15.18l1.67-6.73h1.1l1.69,6.8,1.69-6.8Z"
                    />
                </g>
            </g>
        </svg>
        <svg
            id="s"
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 81.5 53.19"
        >
            <g id="g4288">
                <rect
                    id="sback"
                    x="28.98"
                    y="28.94"
                    width="23.53"
                    height="23.49"
                    style="fill:#f2f2f2;stroke:#000;stroke-linecap:round;stroke-linejoin:round;stroke-width:1.5px"
                />
                <g id="text5543">
                    <path
                        id="path4283"
                        d="M43.87,42.43a2.11,2.11,0,0,1-.22.93,2.27,2.27,0,0,1-.62.79,3.25,3.25,0,0,1-1,.54,4.39,4.39,0,0,1-1.39.2,6.89,6.89,0,0,1-1.58-.17,8.2,8.2,0,0,1-1.42-.48V42.89h.07a4.68,4.68,0,0,0,1.42.79,4.81,4.81,0,0,0,1.52.28,2.75,2.75,0,0,0,1.55-.38,1.13,1.13,0,0,0,.56-1,1.11,1.11,0,0,0-.26-.8,1.81,1.81,0,0,0-.8-.39c-.28-.07-.57-.13-.89-.18l-1-.18a3,3,0,0,1-1.6-.78,2,2,0,0,1-.51-1.44,2,2,0,0,1,.86-1.67,3.53,3.53,0,0,1,2.18-.65,6.84,6.84,0,0,1,1.56.17,6.55,6.55,0,0,1,1.27.4v1.27h-.08a3.69,3.69,0,0,0-1.22-.65,4.74,4.74,0,0,0-1.54-.26,2.43,2.43,0,0,0-1.39.36,1.08,1.08,0,0,0-.52.93,1.11,1.11,0,0,0,.26.79,1.75,1.75,0,0,0,.92.44l1,.19c.43.07.79.14,1.09.22a2.88,2.88,0,0,1,1.36.72,1.94,1.94,0,0,1,.45,1.36Z"
                    />
                </g>
            </g>
        </svg>
        <svg
            id="d"
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 81.5 53.19"
        >
            <g id="g4288">
                <rect
                    id="dback"
                    x="57.22"
                    y="28.94"
                    width="23.53"
                    height="23.49"
                    style="fill:#f2f2f2;stroke:#000;stroke-linecap:round;stroke-linejoin:round;stroke-width:1.5px"
                />
                <g id="text5547">
                    <path
                        id="path4280"
                        d="M72.41,40.7a4.09,4.09,0,0,1-.49,2,3.52,3.52,0,0,1-1.28,1.39,4.14,4.14,0,0,1-1.24.5,8.59,8.59,0,0,1-1.79.15h-2v-8.1h2a8.42,8.42,0,0,1,1.88.17,4.34,4.34,0,0,1,1.19.47,3.54,3.54,0,0,1,1.28,1.38A4.21,4.21,0,0,1,72.41,40.7Zm-1.13,0a3.51,3.51,0,0,0-.33-1.6,2.4,2.4,0,0,0-1-1,3.4,3.4,0,0,0-1-.38,6.82,6.82,0,0,0-1.29-.11h-1v6.25h1A6.86,6.86,0,0,0,69,43.7a3.18,3.18,0,0,0,1.06-.42,2.42,2.42,0,0,0,.91-1A3.68,3.68,0,0,0,71.28,40.68Z"
                    />
                </g>
            </g>
        </svg>
    </div>
</template>

<script>
export default {
    mounted () {
        const w = document.getElementById('wback')
        const a = document.getElementById('aback')
        const s = document.getElementById('sback')
        const d = document.getElementById('dback')
        document.onkeydown = e => {
            switch (e.code) {
                case 'KeyW':
                    w.style.fill = '#f1c40f'
                    break
                case 'KeyA':
                    a.style.fill = '#e74c3c'
                    break
                case 'KeyS':
                    s.style.fill = '#2ecc71'
                    break
                case 'KeyD':
                    d.style.fill = '#3498db'
                    break
                default:
                    break
            }
        }
        document.onkeyup = e => {
            switch (e.code) {
                case 'KeyW':
                    w.style.fill = '#f2f2f2'
                    break
                case 'KeyA':
                    a.style.fill = '#f2f2f2'
                    break
                case 'KeyS':
                    s.style.fill = '#f2f2f2'
                    break
                case 'KeyD':
                    d.style.fill = '#f2f2f2'
                    break
                default:
                    break
            }
        }
    }
}
</script>

<style scoped>
#keys svg,
#keys {
    width: 81px;
    height: 53px;
    position: absolute;
    transform: scale(1.5);
}
</style>
