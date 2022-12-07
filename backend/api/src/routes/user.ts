import { Router } from "express"
import passport from "passport"
import { mustAuth, mustService } from "./utils"
import UserAccess from "../data_access/userAccess"
import { User } from "../models/User"
import { ModifiableUser } from "../models/ModifiableUser"
import AchievementFront from "../models/AchievementsFront"
import calculate_xp from "../utils/xp_calculator"
import calculate_level from "../utils/level_calculator"
import ItemPool from "../utils/itemsGetter"
import pool from "../data_access/pool"
import StatsAccess from "../data_access/statsAccess"

const router = Router()

router.get("/user", mustAuth, (req, res) => {
    const user = { ...req.user } as User
    delete user.id
    res.json(user)
})

router.post('/user-email', mustService, async (req, res) => {
    const publicId: string = req?.body?.publicId
    const user = await UserAccess.getUserByPubliciId(publicId)
    if (user) {
        res.json({ email: user.email })
    }
    else {
        res.sendStatus(404)
    }
})

router.post("/user", mustAuth, async (req, res) => {
    const userModif = { ...req.body.user } as ModifiableUser
    const user = { ...req.user } as User
    if (Object.values(userModif).some(x => (x == undefined))) {
        return res.status(400).json({ reason: "invalid request" })
    }

    if (!user.unlockables.uAvatar.includes(userModif.avatar)) {
        return res.status(400).json({ reason: "this avatar is not unlocked" })
    }
    if (!user.unlockables.uPattern.includes(userModif.pattern)) {
        return res.status(400).json({ reason: "this pattern is not unlocked" })
    }
    const newuser = await UserAccess.updateUserProfile(user, userModif)
    if (newuser === null) {
        return res.sendStatus(500)
    }
    return res.json(newuser.getPublicUser())
})

router.post("/private-id-to-user", mustService, async (req, res) => {
    const privateId: string = req?.body?.privateId
    const user = await UserAccess.getUser(privateId)
    if (user) {
        res.json(user.getPublicUser())
    }
    else {
        res.sendStatus(404)
    }
})

router.get("/public-id-to-user", async (req, res) => {
    const publicId: string = req?.query?.publicId
    const user = await UserAccess.getUserByPubliciId(publicId)
    if (user) {
        res.json(user.getPublicUser())
    }
    else {
        res.sendStatus(404)
    }
})

router.post("/achievement", mustAuth, async (req, res) => {
    const achievementId: string = req?.body?.achievementId
    if (achievementId in AchievementFront) {
        const achievement: string = AchievementFront[achievementId]
        const user = { ...req.user } as User
        if (user.unlockables.uAchievement.includes(achievement)) {
            return res.sendStatus(418)
        }
        const result = await UserAccess.unlockAchievement(user, achievement)
        if (!result) {
            return res.sendStatus(500)
        }
        return res.json(result)
    }
})

router.post("/endgame-xp", mustService, async (req, res) => {
    //{"seconds_in_game", "player_list", "winners" | "ordered_winners"}
    try {
        req.body.seconds = Math.ceil(req.body.seconds)
        const seconds = req.body.seconds > 1200 ? 1200 : req.body.seconds
        const players: string[] = req.body.players
        const winners: string[] = req.body.winners
        const gameName: string | null = req.body.gameName

        const users = await Promise.all(players.map(player => UserAccess.getUserByPubliciId(player)))
        const dbRequests: Promise<User | null>[] = []
        const validatedResults: { [key: string]: any } = {}
        const allXpInfos: { [key: string]: any } = {}
        const newItems: { [key: string]: [string, string][] } = {}
        for (let user of users) {
            if (user === null || user === undefined) {
                continue
            }
            const isWinner = winners.includes(user.publicId)
            const xpInfos = calculate_xp(user, isWinner, seconds)
            const xpToAdd = xpInfos['total']
            xpInfos['previousLevel'] = user?.level
            xpInfos['previousXp'] = user?.xp
            const [level, xp] = calculate_level(user.level, user.xp, xpToAdd)
            const levelDif = level - user.level
            if (levelDif > 0) {
                newItems[user.publicId] = []
                for (let i = 0; i < levelDif; ++i) {
                    const [poolName, unlockedItem] = ItemPool.getItemToUnlock(user)
                    const stringItem = String.fromCharCode(unlockedItem)
                    const res = await ItemPool.getDbCall(poolName)(user, stringItem)
                    if (res !== null) {
                        newItems[user.publicId].push([stringItem, poolName])
                    }
                }
            }
            allXpInfos[user.publicId] = xpInfos
            dbRequests.push(UserAccess.addXp(user, level, xp))
        }
        const validatedUsers = await Promise.all(dbRequests)
        for (let user of validatedUsers) {
            if (user === null || user === undefined) {
                continue
            }
            allXpInfos[user.publicId]['newLevel'] = user.level
            allXpInfos[user.publicId]['newXp'] = user.xp
            validatedResults[user.publicId] = allXpInfos[user.publicId]
        }
        res.json({ xpInfos: validatedResults, newItems: newItems })
        users.map((player) => {
            if (player === null) {
                return
            }
            if (gameName !== null && players.length > 1) {
                return StatsAccess.updateStats(gameName, player.publicId, winners.includes(player.publicId), req.body.seconds)
            }
        })

    } catch (error) {
        console.log(error)
        res.json({ 'error': 'failed to send xp' })
    }


})

export default router