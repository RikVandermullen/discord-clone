import { Message } from "./Message";
import { User } from "./User";
import { ServerType } from "./ServerType";

export class Server {
    _id: string;
    name: string;
    owner: User;
    date_created: Date;
    users: User[];
    lastMessageRead: Map<string, string>;
    messages: Message[];
    newMessage: boolean;
    type: ServerType;

    constructor(
        _id: string,
        name: string,
        owner: User,
        date_created: Date,
        users: User[],
        lastMessageRead: Map<string, string>,
        messages: Message[],
        type: ServerType
    ) {
        this._id = _id;
        this.name = name;
        this.owner = owner;
        this.date_created = date_created;
        this.users = users;
        this.lastMessageRead = lastMessageRead;
        this.messages = messages;
        this.type = type;
    }
}
