export class User {
    _id: number;
    userName: string;
    password: string;
    created_at: Date;

    constructor(_id: number, userName: string, password: string, created_at: Date) {
        this._id = _id;
        this.userName = userName;
        this.password = password;
        this.created_at = created_at;
    }
}