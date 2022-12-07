import { Router } from "express"
import { mustAuth, mustService } from "./utils"
import StatsAccess from "../data_access/statsAccess"

const router = Router()

router.get('/user', async (req, res) => {
    const publicId: string = req?.query?.publicId
    const dbRes = await StatsAccess.getStats(publicId)
    res.json(dbRes)
})

export default router