function getLevelMaxXp(level: number) {
    if (level < 10) {
        return ((level * (level + 1)) / 2) * 100
    }
    return 1000
}
export default function calculate_level(level: number, xp: number, newXp: number) {
    xp += newXp
    while (xp > getLevelMaxXp(level)) {
        xp -= getLevelMaxXp(level)
        level += 1
    }
    return [level, xp]
}
