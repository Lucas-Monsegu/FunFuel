import pool from "./pool"
import pgFormat from 'pg-format'

export default class StatsAccess {
    private static async addGameColumn(name: string) {
        const formatedRequest = pgFormat('ALTER TABLE main.stats ADD COLUMN IF NOT EXISTS %I integer[] NOT NULL DEFAULT Array[0,0,0]', name)
        const request = formatedRequest
        try {
            const res = await pool.query(request)
            return true
        } catch (error) {
            console.log('error while altering column ', error)
            return false
        }
    }

    static async updateStats(game: string, publicId: string, win: boolean, secondsInGame: number): Promise<boolean> {
        async function executeRequest() {
            const formatedRequest = pgFormat('INSERT INTO main.stats(user_id, %I)VALUES ($1,Array[$2::integer,$3::integer,$4::integer])ON CONFLICT (user_id) DO UPDATE SET %I=Array[main.stats.%I[1]+$2, main.stats.%I[2]+$3, main.stats.%I[3]+$4]', game, game, game, game, game)
            const request = formatedRequest
            const values = [publicId, 1, win === true ? 1 : 0, secondsInGame]
            const res = await pool.query(request, values)
        }

        try {
            await executeRequest()
            return true
        } catch (error) {
            if (error.code !== '42703') {
                console.log('unexpected error while adding stats for game', error, game, publicId, win, secondsInGame)
                return false
            }
            try {
                await this.addGameColumn(game)
                await executeRequest()
                return true
            }
            catch (error2) {
                console.log('unexpected error while adding game column', error2)
                return false
            }
        }
    }
    static async getStats(publicId: string): Promise<number[] | null> {
        const request = "SELECT * FROM main.stats WHERE user_id=$1;"
        const values = [publicId]
        try {
            const res = await pool.query(request, values)
            const result = res.rows[0]
            if (!result) {
                return null
            }
            return result
        } catch (error) {
            console.log(error)
            return null
        }
    }
}