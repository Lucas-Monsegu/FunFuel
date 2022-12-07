import Unlockables from "./Unlockables"
export enum APIType {
    Discord,
    Google
}

export class User {
    constructor(
        public apiType: APIType,
        public apiID: string,
        public username: string,
        public level: number,
        public xp: number,
        public id: string,
        public lastWonGame: Date | null,
        public publicId: string,
        public syncName: boolean,
        public apiName: string,
        public email: string,

        public unlockables: Unlockables
    ) { }

    static createUserFromDbResult(result: any) {
        return new User(result["api_type"],
            result["api_id"],
            result["username"],
            result["level"],
            result["xp"],
            result["id"],
            result["last_won_game"],
            result["public_id"],
            result["sync_name"],
            result["api_name"],
            result['email'],
            new Unlockables(result["u_avatar"],
                result["avatar"],
                result["u_pattern"],
                result["pattern"],
                result["u_achievement"],
                result["achievement"]
            )
        )
    }
    getPublicUser() {
        return {
            username: this.username,
            level: this.level,
            xp: this.xp,
            public_id: this.publicId,
            ...this.unlockables
        }
    }

}