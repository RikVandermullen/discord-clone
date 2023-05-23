import { Inject, Injectable, InjectionToken, Optional } from "@angular/core";
import { Observable } from "rxjs";
import { io, Socket } from "socket.io-client";
import { Message } from "../models/Message";
import { User } from "../models/User";
import { JwtPayload } from "jwt-decode";
import jwt_decode from "jwt-decode";

/**
 * @todo: add security
 */
@Injectable()
export class WebsocketService {
    private socket: Socket;

    constructor() {
        const decodedToken = jwt_decode<JwtPayload>(
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            localStorage.getItem("currentuser")!
        );
        const userId = JSON.parse(JSON.stringify(decodedToken)).user._id;

        this.socket = io("http://localhost:3333", {
            query: { userId: userId }
        });
    }

    onNewMessage(): Observable<Message> {
        return new Observable((observer) => {
            this.socket.on("onMessage", (data: Message) => {
                observer.next(data);
            });
        });
    }

    onDeletedMessage(): Observable<Message> {
        return new Observable((observer) => {
            this.socket.on("onDeletedMessage", (data: Message) => {
                observer.next(data);
            });
        });
    }

    onEditedMessage(): Observable<Message> {
        return new Observable((observer) => {
            this.socket.on("onEditedMessage", (data: Message) => {
                observer.next(data);
            });
        });
    }

    onDisplayStatusChange(): Observable<User> {
        return new Observable((observer) => {
            this.socket.on("onDisplayStatusChange", (data: User) => {
                observer.next(data);
            });
        });
    }

    onStatusChange(): Observable<User> {
        return new Observable((observer) => {
            this.socket.on("onStatusChange", (data: User) => {
                observer.next(data);
            });
        });
    }

    onSendFriendRequest(): Observable<User> {
        return new Observable((observer) => {
            this.socket.on("onFriendRequest", (data: User) => {
                observer.next(data);
            });
        });
    }

    onCancelFriendRequest(): Observable<User> {
        return new Observable((observer) => {
            this.socket.on("onFriendRequestCancel", (data: User) => {
                observer.next(data);
            });
        });
    }

    onUpdateFriendRequest(): Observable<User> {
        return new Observable((observer) => {
            this.socket.on("onFriendRequestUpdate", (data: User) => {
                observer.next(data);
            });
        });
    }

    sendMessage(message: Message) {
        this.socket.emit("newMessage", message);
    }

    deleteMessage(message: Message) {
        this.socket.emit("deleteMessage", message);
    }

    editMessage(message: Message) {
        this.socket.emit("editMessage", message);
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

    setStatus(user: User) {
        this.socket.emit("setDisplayStatus", user);
    }

    disconnect() {
        this.socket.disconnect();
    }

    sendFriendRequest(user: string, friend: string) {
        this.socket.emit("sendFriendRequest", {
            user: user,
            friend: friend,
            status: "Pending"
        });
    }

    updateFriendRequest(user: string, friend: string, status: string) {
        this.socket.emit("updateFriendRequest", {
            user: user,
            friend: friend,
            status: status
        });
    }

    cancelFriendRequest(user: string, friend: string) {
        this.socket.emit("cancelFriendRequest", {
            user: user,
            friend: friend
        });
    }
}
