export class Message {
    _id: number;
    content: string;
    date: Date;
    author: string;
    room: string | null;

    constructor(_id: number, content: string, date: Date, author: string) {
        this._id = _id;
        this.content = content;
        this.date = date;
        this.author = author;
    }
}
