import express from "express"
import { register } from "prom-client"
import Metrics from "./Metrics"
import { metricsToken } from "../../config"
import Log from "../utils/Log"

const router = express.Router()
router.get("/metrics/:token", (req, res) => {
    if (req.params.token !== metricsToken) {
        return res.sendStatus(401)
    }
    res.set("Content-Type", register.contentType)
    res.end(register.metrics())
    Metrics.reset()
    Log.info("reseting metrics")
})

export default router