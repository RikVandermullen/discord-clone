import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { io, Socket } from "socket.io-client";
import { Message } from "../models/Message";
import { User } from "../models/User";

@Injectable()
export class WebsocketService {
    private socket: Socket;

    constructor() {
        this.socket = io("http://localhost:3333");
    }

    onNewMessage(): Observable<Message> {
        return new Observable((observer) => {
            this.socket.on("onMessage", (data: Message) => {
                observer.next(data);
            });
        });
    }

    sendMessage(message: Message) {
        this.socket.emit("newMessage", message);
    }

    createServer(server: string, userId: string) {
        this.socket.emit("createServer", {
            server: server,
            user: userId
        });
    }

    joinServer(server: string, userId: string) {
        this.socket.emit("joinServer", {
            server: server,
            user: userId
        });
    }

    leaveServer(server: string, userId: string) {
        this.socket.emit("leaveServer", {
            server: server,
            user: userId
        });
    }
}
