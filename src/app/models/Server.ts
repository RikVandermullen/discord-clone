import { Message } from "./Message";
import { User } from "./User";

export class Server {
    _id: string;
    name: string;
    users: User[];
    messages: Message[];

    constructor(_id: string, name: string, users: User[], messages: Message[]) {
        this._id = _id;
        this.name = name;
        this.users = users;
        this.messages = messages;
    }
}
