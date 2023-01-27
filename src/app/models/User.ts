import { Status } from "./Status";

export class User {
    _id: string;
    emailAddress: string;
    userName: string;
    password: string;
    date_created: Date;
    dateOfBirth: Date;
    status: Status;

    constructor(
        _id: string,
        emailAddress: string,
        userName: string,
        password: string,
        dateOfBirth: Date,
        date_created: Date,
        status: Status
    ) {
        this._id = _id;
        this.emailAddress = emailAddress;
        this.userName = userName;
        this.password = password;
        this.dateOfBirth = dateOfBirth;
        this.date_created = date_created;
        this.status = status;
    }
}

export class UserCredentials {
    emailAddress: string;
    password: string;

    constructor(emailAddress: string, password: string) {
        this.emailAddress = emailAddress;
        this.password = password;
    }
}
