import { Pool } from "pg"
import { pgConfig } from "../config"

export default new Pool(pgConfig)
