import { Status } from "./Status";

export class User {
    _id: number;
    userName: string;
    password: string;
    created_at: Date;
    status: Status;

    constructor(
        _id: number,
        userName: string,
        password: string,
        created_at: Date,
        status: Status
    ) {
        this._id = _id;
        this.userName = userName;
        this.password = password;
        this.created_at = created_at;
        this.status = status;
    }
}
