import Roles from "./Roles"

export default class PlayerInfos {

    #role: Roles
    history: string[] = []
    constructor(
        public id: string,
        role: Roles,
        public alive: boolean,
        public word: string | undefined,
        public vote: string | undefined,
    ) {
        this.#role = role
        this.alive = true
        this.word = undefined
        this.vote = undefined
    }
    public getRole() {
        return this.#role
    }
}
