import { User, APIType } from "../models/User"
import pool from "./pool"
import { ModifiableUser } from "../models/ModifiableUser"

export default class UserAccess {
    static async getUser(id: string): Promise<User | null> {
        console.log('searching:', id)
        const request = "SELECT * from main.user WHERE id=$1"
        const values = [id]
        try {
            const res = await pool.query(request, values)
            const result = res.rows[0]
            if (!result) {
                return null
            }
            return User.createUserFromDbResult(result)
        } catch (error) {
            console.log(error)
            return null
        }
    }
    static async getUserByApiId(apiId: string): Promise<User | null> {
        const request = "SELECT * from main.user WHERE api_id=$1"
        const values = [apiId]
        try {
            const res = await pool.query(request, values)
            const result = res.rows[0]
            if (!result) {
                return null
            }
            return User.createUserFromDbResult(result)
        } catch (error) {
            console.log('error ', error)
            return null
        }
    }
    static async getUserByPubliciId(publicId: string): Promise<User | null> {
        const request = "SELECT * from main.user WHERE public_id=$1"
        const values = [publicId]
        try {
            const res = await pool.query(request, values)
            const result = res.rows[0]
            if (!result) {
                return null
            }
            return User.createUserFromDbResult(result)
        } catch (error) {
            console.log(error)
            return null
        }
    }

    static async addUser(username: string, apiType: APIType, apiId: String, email: String): Promise<any> {
        const request = "INSERT INTO main.user(username, api_type, api_id, api_name, email) VALUES($1, $2, $3, $4, $5) RETURNING *"
        const values = [username, apiType, apiId, username, email]
        try {
            const res = await pool.query(request, values)
            return res.rows[0]
        } catch (error) {
            console.log(error)
            return null
        }
    }
    static async updateUser(userId: string, username: string): Promise<any> {
        const request = "UPDATE main.user SET username=$2, api_name=$3 WHERE id=$1 RETURNING *"
        const values = [userId, username, username]
        try {
            const res = await pool.query(request, values)
            return res.rows[0]
        } catch (error) {
            console.log(error)
            return null
        }
    }
    static async updateUserOnlyApiName(userId: string, apiname: string) {
        const request = "UPDATE main.user SET api_name=$2 WHERE id=$1 RETURNING *"
        const values = [userId, apiname]
        try {
            const res = await pool.query(request, values)
            return res.rows[0]
        } catch (error) {
            console.log(error)
            return null
        }
    }
    static async updateUserWithAvatar(userId: string, username: string, avatar: string) {
        const request = "UPDATE main.user SET username=$2, avatar WHERE id=$1 RETURNING *"
        const values = [userId, username, avatar]
        try {
            const res = await pool.query(request, values)
            return User.createUserFromDbResult(res.rows[0])
        } catch (error) {
            console.log(error)
            return null
        }
    }
    static async updateUserProfile(user: User, u: ModifiableUser) {
        const request = "UPDATE main.user SET pattern=$2, avatar=$3, username=$4, sync_name=$5, achievement=$6 WHERE id=$1 RETURNING *"
        u.username = u.syncName ? user.apiName : u.username
        const values = [user.id, u.pattern, u.avatar, u.username, u.syncName, u.achievement]
        try {
            const res = await pool.query(request, values)
            return User.createUserFromDbResult(res.rows[0])

        } catch (error) {
            console.log(error)
            return null
        }
    }
    static async unlockAchievement(user: User, achievementString: string) {
        const request = "UPDATE main.user SET u_achievement=$2 WHERE id=$1 RETURNING *"
        const newString = Array.from(new Set(user.unlockables.uAchievement + achievementString)).join('')
        const values = [user.id, user.unlockables.uAchievement + achievementString]
        try {
            const res = await pool.query(request, values)
            return User.createUserFromDbResult(res.rows[0])

        } catch (error) {
            console.log(error)
            return null
        }
    }
    static async unlockPattern(user: User, pattern: string) {
        const request = "UPDATE main.user SET u_pattern=$2 WHERE id=$1 RETURNING *"
        const newString = Array.from(new Set(user.unlockables.uPattern + pattern)).join('')
        const values = [user.id, newString]

        try {
            const res = await pool.query(request, values)
            return User.createUserFromDbResult(res.rows[0])

        } catch (error) {
            console.log(error)
            return null
        }
    }
    static async unlockAvatar(user: User, avatar: string) {
        const request = "UPDATE main.user SET u_avatar=$2 WHERE id=$1 RETURNING *"
        const newString = Array.from(new Set(user.unlockables.uAvatar + avatar)).join('')
        const values = [user.id, newString]

        try {
            const res = await pool.query(request, values)
            return User.createUserFromDbResult(res.rows[0])

        } catch (error) {
            console.log('error in unlock avatar', error)
            return null
        }
    }
    static async addXp(user: User, level: number, xp: number) {
        const request = "UPDATE main.user SET level=$2, xp=$3, last_won_game=NOW() WHERE id=$1 RETURNING *"
        const values = [user.id, level, xp]
        try {
            const res = await pool.query(request, values)
            return User.createUserFromDbResult(res.rows[0])

        } catch (error) {
            console.log(error)
            return null
        }

    }
}