import dotenv from "dotenv"

dotenv.config({
    path: process.env.NODE_ENV === "production" ? "./src/config/.env.production" : "./src/config/.env.development"
})

export const dispatchToken = process.env.dispatchToken
export const metricsToken = process.env.metricsToken
export const promJson = process.env.promJson ?? "/home/gitlab/.prometheus/node.json"
export const port: number = parseInt(process.env.port ?? "")
export const isProd: boolean = process.env.NODE_ENV === "production"