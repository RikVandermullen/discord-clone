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

    createRoom(room: string, userId: string) {
        this.socket.emit("createRoom", {
            room: room,
            user: userId
        });
    }

    joinRoom(room: string, userId: string) {
        this.socket.emit("joinRoom", {
            room: room,
            user: userId
        });
    }

    leaveRoom(room: string, userId: string) {
        this.socket.emit("leaveRoom", {
            room: room,
            user: userId
        });
    }
}
