import express from "express"
import { register } from "prom-client"
import Metrics from "./Metrics"

const router = express.Router()

router.get("/metrics", (req, res) => {
    res.set("Content-Type", register.contentType)
    res.end(register.metrics())
})

router.get("/metrics/counter", (req, res) => {
    res.set("Content-Type", register.contentType)
    res.end(register.getSingleMetricAsString("test_counter"))
})

export default router