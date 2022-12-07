import dotenv from "dotenv"

dotenv.config({
    path: process.env.NODE_ENV === "production" ? "./config/.env.production" : "./src/config/.env.development"
})

export const dispatchToken = process.env.dispatchToken
export const isProd: boolean = process.env.NODE_ENV === "production"
export const port: number = parseInt(process.env.port ?? "")
export const serviceUrl = isProd ? `${process.env.serviceUrl}` : `${process.env.serviceUrl}:${port}`
export const mainUrl = isProd ? `https://${process.env.mainUrl}` : `http://${process.env.mainUrl}`
export const dispatcherHttp = isProd ? `https://${process.env.dispatcherUrl}` : `http://${process.env.dispatcherUrl}`
export const dispatcherWs = isProd ? `wss://${process.env.dispatcherUrl}/` : `ws://${process.env.dispatcherUrl}/`
export const gameName = process.env.gameName
export const metricsToken = process.env.metricsToken