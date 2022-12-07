import dotenv from "dotenv"

dotenv.config({
    path: process.env.NODE_ENV === "production" ? "./src/config/.env.production" : "./src/config/.env.development"
})

export const dispatchToken = process.env.dispatchToken