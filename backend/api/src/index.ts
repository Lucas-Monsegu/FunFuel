import express from "express"
import passport from "./config/passport"
import cookie from "cookie-session"
import { port, isProd } from "./config"
import routers from "./routes"
import ItemPool from "./utils/itemsGetter"
import UserAccess from "./data_access/userAccess"
import StatsAccess from "./data_access/statsAccess"

(async () => {
    const r = await ItemPool.init()
    if (!r) {
        console.error('EXIT: failed to fetch items froms s3')
        process.exit()
    }

})()

const app = express()

// post parsing setup
app.use(express.json())
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", isProd ? "https://funfuel.io" : "http://localhost:8080")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    if (!isProd) {
        res.header("Access-Control-Allow-Credentials", "true")
    }
    next()
})
// passport setup
app.use(
    cookie({
        maxAge: 86400000,
        keys: ["d1a5z6rf4z8a9d1za5d3"],
        domain: isProd ? ".funfuel.io" : "localhost"
    })
)
app.use(passport.initialize())
app.use(passport.session())
for (const router of Object.entries(routers)) {
    app.use(router[0], router[1])
}
app.listen(port, function () {
    console.log(`Listening on port ${port}!`)
})