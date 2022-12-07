import auth from "./auth"
import user from "./user"
import stats from './stats'

export default {
    "/api/auth": auth,
    "/api/stats": stats,
    "/api": user
}