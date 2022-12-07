export default function CookieToObject(cookie: string = ""): any {
    return cookie
        .split(";")
        .reduce((res, c) => {
            const [key, val] = c.trim().split("=").map(decodeURIComponent)
            const allNumbers = (str: string) => /^\d+$/.test(str)
            try {
                return Object.assign(res, { [key]: allNumbers(val) ? val : JSON.parse(val) })
            } catch (e) {
                return Object.assign(res, { [key]: val })
            }
        }, {})
}