import fs from "fs"
import { promJson, metricsToken } from "../config"
import Log from "./Log"

export const addService = (game: string, path: string) => {
    const t = path.split('/')
    let server = t[0]
    let p = t[1]
    let newObj = {
        "targets": [t[0]],
        "labels": {
            "job": game,
            "__metrics_path__": `${p}/metrics/${metricsToken}`
        }
    }
    fs.readFile(promJson, "utf-8", (err, data) => {
        if (err) throw err
        const json = JSON.parse(data)
        const sameGame = json.find((obj: any) => obj.labels.job === game)
        if (sameGame) {
            if (!sameGame.targets.includes(server)) {
                sameGame.targets.push(t[0])
            }
        }
        else {
            json.push(newObj)
        }
        const result = JSON.stringify(json)
        fs.writeFile(promJson, result, "utf-8", err => {
            if (err) throw err
            Log.info("Service added to prometheus")
        })
    })
}

export const deleteService = (game: string, path: string) => {
    path = path.split('/')[1]
    fs.readFile(promJson, "utf-8", (err, data) => {
        if (err) throw err
        const json = JSON.parse(data)
        const sameGame = json.find((obj: any) => obj.labels.job === game)
        if (sameGame) {
            const targets = sameGame.targets
            const targetIndex = targets.indexOf(path)
            if (targetIndex !== -1) {
                targets.splice(targetIndex, 1)
            }
            if (targets.length === 0) {
                const gameIndex = json.indexOf(sameGame)
                if (gameIndex !== -1) {
                    json.splice(gameIndex, 1)
                }
            }
        }
        const result = JSON.stringify(json)
        fs.writeFile(promJson, result, "utf-8", err => {
            if (err) throw err
            Log.info("Service deleted from prometheus")
        })
    })
}