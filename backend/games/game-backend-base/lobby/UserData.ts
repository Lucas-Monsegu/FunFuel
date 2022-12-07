

export default class UserData {
    username: string
    level: string
    avatar: string
    public_id: string

    constructor(data: any) {
        this.level = data.level
        this.username = data.username
        this.avatar = data.avatar
        this.public_id = data.public_id
    }
}