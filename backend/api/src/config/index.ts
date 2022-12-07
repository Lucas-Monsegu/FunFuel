import dotenv from "dotenv"

dotenv.config({
    path: process.env.NODE_ENV === "production" ? "./src/config/.env.production" : "./src/config/.env.development"
})

export const dispatchToken = process.env.dispatchToken
export const pgConfig = {
    user: process.env.pgUser,
    host: process.env.pgHost,
    database: process.env.pgDatabase,
    password: process.env.pgPassword,
    port: parseInt(process.env.pgPort ?? "")
}
export const isProd = process.env.NODE_ENV === "production"

export const port = process.env.port