import { Router, Request, Response, NextFunction } from "express"
import passport from "passport"
import { mustAuth, saveReturnTo } from "./utils"
import { isProd } from "../config"

const router = Router()
const frontUrl = isProd ? "/" : "http://localhost:8080/"

const enum APIType {
    Discord = "discord",
    Google = "google"
}

const sessionResume = (api: APIType) =>
    (req: Request, res: Response, next: NextFunction) => {
        passport.authenticate(api, (err, user) => {
            if (err) { return next(err) }
            if (!user) { return res.redirect(`/api/auth/${api}`) }
            req.logIn(user, _ => {
                if (req.session) {
                    const ret = req.session.returnTo
                    delete req.session.returnTo
                    if (ret) {
                        return res.redirect(ret)
                    }
                }
                return res.redirect(`/api/auth/${api}`)
            })
        })(req, res, next)
    }

router.get(
    "/logout", mustAuth, (req, res) => {
        req.logout()
        return res.sendStatus(200)
    }
)

// google
router.get(
    "/google",
    saveReturnTo,
    passport.authenticate("google", {
        scope: ["profile", "email"]
    })
)

router.get(
    "/google/redirect",
    sessionResume(APIType.Google)
)

// discord
router.get(
    "/discord",
    saveReturnTo,
    passport.authenticate("discord", {
        scope: ["identify", "email"]
    })
)

router.get(
    "/discord/redirect",
    sessionResume(APIType.Discord)
)

export default router