import { User } from "./User";

export class Message {
    _id: string;
    content: string;
    date_created: Date;
    author: User;
    server: string | null;
    isEdited: boolean;

    constructor(
        _id: string,
        content: string,
        date_created: Date,
        author: User,
        isEdited: boolean
    ) {
        this._id = _id;
        this.content = content;
        this.date_created = date_created;
        this.author = author;
        this.isEdited = isEdited;
    }
}
