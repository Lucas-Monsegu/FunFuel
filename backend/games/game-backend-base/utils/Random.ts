export default class Random {
    static int(min: number, max: number) {
        return Math.floor(Math.random() * (max - min) + min)
    }


    static range(min: number, max: number) {
        return Math.random() * (max - min) + min
    }


    static fromArray(array: any[]) {
        return array[Random.int(0, array.length)]
    }

    static shuffeArray(arra1: any[]) {
        let ctr = arra1.length
        let temp
        let index
        while (ctr > 0) {
            index = Math.floor(Math.random() * ctr)
            ctr--
            temp = arra1[ctr]
            arra1[ctr] = arra1[index]
            arra1[index] = temp
        }
        return arra1
    }
}
