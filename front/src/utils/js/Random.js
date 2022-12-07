export default class Random {
    /**
     * Return an randomInt between [min, max[
     * @param min minimum (included)
     * @param max maximum (excluded)
     */
    static int (min, max) {
        return Math.floor(Math.random() * (max - min) + min)
    }

    /**
     * Return a float between [min, max[
     * @param min minimum (included)
     * @param max maximum (excluded)
     */
    static range (min, max) {
        return Math.random() * (max - min) + min
    }

    /**
     * Return a random item from an array
     * @param array
     */
    static fromArray (array) {
        return array[Random.int(0, array.length)]
    }
}
