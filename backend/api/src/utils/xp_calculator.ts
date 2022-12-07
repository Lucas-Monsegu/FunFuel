import { User } from "../models/User";

const FIRSTWINOFTHEDAY = 150
const WINNERBONUS = 75
const BONUSPERMINUTE = 50

export default function calculate_xp(user: User, winner: boolean, timeInGame: number): { [key: string]: number } {
    let total = 0
    let diffTime = 0
    if (user.lastWonGame === null) {
        diffTime = 100000000
    }
    else {
        diffTime = Math.abs(Date.now() - user.lastWonGame.getTime());
    }
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const minutesInGame = Math.round(Math.round(timeInGame) / 60)
    if (diffDays > 0) {
        total += FIRSTWINOFTHEDAY
    }
    if (minutesInGame < 1) {
        return {
            firstWin: total,
            winner: 0,
            timeIg: 0,
            totalXp: total
        }
    }
    if (winner) {
        total += WINNERBONUS
    }
    total += minutesInGame * BONUSPERMINUTE
    return {
        firstWin: diffDays > 0 ? FIRSTWINOFTHEDAY : 0,
        winner: winner ? WINNERBONUS : 0,
        timeIg: minutesInGame * BONUSPERMINUTE,
        total: total
    }
}