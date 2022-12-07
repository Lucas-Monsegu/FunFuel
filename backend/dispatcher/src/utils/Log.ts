export default class Log {
    private static options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
    };

    static debug(...log: any[]) {
        console.debug(`${new Date().toLocaleDateString("en-US", this.options)} [DEBUG]`, ...log)
    }

    static info(...log: any[]) {
        console.info(`${new Date().toLocaleDateString("en-US", this.options)}  [INFO]`, ...log)
    }

    static warn(...log: any[]) {
        console.warn(`${new Date().toLocaleDateString("en-US", this.options)}  [WARN]`, ...log)
    }

    static error(...log: any[]) {
        console.error(`${new Date().toLocaleDateString("en-US", this.options)} [ERROR]`, ...log)
    }
}