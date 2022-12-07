import ChangeUsername from "./ChangePlayerName"
import ChangeTeamName from "./ChangeTeamName"
import ChangePlayerTeam from "./ChangePlayerTeam"
import fs from "fs"
import { isProd } from "../../config"
class CommandData {

    public static commands: { [key: string]: { [key: string]: string } } = {}
    static check(object: any, command: string) {
        if (!(command in this.commands)) {
            console.log(command, "not in commands")
            return false
        }
        const goodObject = this.commands[command]
        for (const prop in goodObject) {
            if (typeof object[prop] !== goodObject[prop]) {
                console.log(prop, object[prop], typeof object[prop], "!==", goodObject[prop])
                return false
            }
        }
        return true
    }
}
fs.readdir(`.${isProd ? "" : "/src"}/base/command_client`, (err, files) => {
    files.forEach(file => {
        if (file !== "index.ts") {
            import("./" + file).then(m => {
                CommandData.commands[file.slice(0, -3)] = m.default
            })
        }
    })
})
fs.readdir(`.${isProd ? "" : "/src"}/game/command_client`, (err, files) => {
    files.forEach(file => {
        if (file !== "index.ts") {
            import("../../game/command_client/" + file).then(m => {
                CommandData.commands[file.slice(0, -3)] = m.default
            })
        }
    })
})
export default CommandData