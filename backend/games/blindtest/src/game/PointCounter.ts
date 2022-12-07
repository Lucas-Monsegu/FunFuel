export default class PointCounter {
    private start: number = 0
    private totalPlayers: number = 0
    private countPlayer: number = 0



    public getPoint() {
        const seconds = 30 - ((Date.now() - this.start) / 1000)
        this.countPlayer += 1
        let secPoints = Math.floor(seconds / 3)
        if (secPoints < 0) {
            secPoints = 0
        }
        else if (secPoints > 10) {
            secPoints = 10
        }
        console.log('sec points', secPoints)
        if (this.countPlayer === 1) {
            return 15 + secPoints
        }
        if (this.countPlayer === this.totalPlayers) {
            return 5 + secPoints
        }
        return 10 + secPoints
    }
    public reset(numberPlayers: number) {
        this.start = Date.now()
        this.totalPlayers = numberPlayers
        this.countPlayer = 0
    }
}