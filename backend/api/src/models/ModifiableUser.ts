export class ModifiableUser {
    constructor(
        public username: string,
        public syncName: boolean,
        public avatar: string,
        public pattern: string,
        public achievement: string
    ) {

    }
}