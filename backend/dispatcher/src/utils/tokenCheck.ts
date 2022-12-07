import { Response, Request, NextFunction } from "express"
import { dispatchToken } from "../config"

export const mustService = (req: Request, res: Response, next: NextFunction) => {
    if (req?.body?.serviceToken !== dispatchToken) {
        res.sendStatus(401)
    }
    else {
        next()
    }
}