import { Message } from "./Message";
import { User } from "./User";

export class Server {
    _id: string;
    name: string;
    owner: User;
    date_created: Date;
    users: User[];
    messages: Message[];

    constructor(
        _id: string,
        name: string,
        owner: User,
        date_created: Date,
        users: User[],
        messages: Message[]
    ) {
        this._id = _id;
        this.name = name;
        this.owner = owner;
        this.date_created = date_created;
        this.users = users;
        this.messages = messages;
    }
}
