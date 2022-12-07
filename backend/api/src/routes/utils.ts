import { Response, Request, NextFunction } from "express"
import { dispatchToken } from "../config"

export const mustAuth = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
        return res.sendStatus(401)
    }
    else {
        next()
    }
}
export const mustService = (req: Request, res: Response, next: NextFunction) => {
    if (req?.body?.token !== dispatchToken) {
        res.sendStatus(401)
    }
    else {
        next()
    }
}

export const saveReturnTo = (req: Request, res: Response, next: NextFunction) => {
    if (req.query.return && req.session) {
        req.session.returnTo = req.query.return
    }
    next()
}