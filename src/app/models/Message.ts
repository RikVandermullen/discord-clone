import { User } from "./User";

export class Message {
    _id: number;
    content: string;
    date_created: Date;
    author: User;
    server: string | null;

    constructor(
        _id: number,
        content: string,
        date_created: Date,
        author: User
    ) {
        this._id = _id;
        this.content = content;
        this.date_created = date_created;
        this.author = author;
    }
}
