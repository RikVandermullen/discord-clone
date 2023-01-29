import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Message } from "../../models/Message";
import { environment } from "../../../environments/environment";
import { map, Observable, tap } from "rxjs";
import { Server } from "../../models/Server";
import { User } from "../../models/User";
import { Status } from "../../models/Status";

@Injectable({
    providedIn: "root"
})
export class ServerService {
    constructor(private http: HttpClient) {}

    getMessagesByServerId(serverId: string) {
        const url = environment.apiUrl + "/api/messages/" + serverId;
        return this.http.get<Message[]>(url).pipe(
            map((response: Message[]) => response),
            tap((messages: Message[]) => {
                return messages;
            })
        );
    }

    getServerById(serverId: string): Observable<Server> {
        const url = environment.apiUrl + "/api/servers/" + serverId;
        return this.http.get<Server>(url).pipe(
            map((response: any) => response[0]),
            tap((server: Server) => {
                return server;
            })
        );
    }

    getServerByUserId(userId: string): Observable<Server[]> {
        const url = environment.apiUrl + "/api/servers/users/" + userId;
        return this.http.get<Server[]>(url).pipe(
            map((response: Server[]) => response),
            tap((servers: Server[]) => {
                return servers;
            })
        );
    }

    createServer(server: Server): Observable<Server> {
        const url = environment.apiUrl + "/api/servers";
        return this.http.post<Server>(url, server).pipe(
            map((response: Server) => response),
            tap((server: Server) => {
                return server;
            })
        );
    }

    joinServer(serverId: string, userId: string): Observable<Server> {
        const url = environment.apiUrl + "/api/servers/join";
        return this.http.post<Server>(url, { serverId, userId }).pipe(
            map((response: Server) => response),
            tap((server: Server) => {
                return server;
            })
        );
    }

    setUserDisplayedStatus(userId: string, status: Status): Observable<User> {
        const url =
            environment.apiUrl + "/api/users/" + userId + "/displayedStatus";
        return this.http.put<User>(url, { userId, status }).pipe(
            map((response: User) => response),
            tap((user: User) => {
                return user;
            })
        );
    }

    setUserOnline(userId: string): Observable<User> {
        const url = environment.apiUrl + "/api/users/" + userId + "/status";
        const status = Status.Online;
        return this.http.put<User>(url, { userId, status }).pipe(
            map((response: User) => response),
            tap((user: User) => {
                return user;
            })
        );
    }

    getUserById(userId: string): Observable<User> {
        const url = environment.apiUrl + "/api/users/" + userId;
        return this.http.get<User>(url).pipe(
            map((response: User) => response),
            tap((user: User) => {
                return user;
            })
        );
    }

    setLastReadMessage(serverId: string, userId: string, messageId: string) {
        const url = environment.apiUrl + "/api/servers/" + serverId;
        return this.http.put<User>(url, { userId, messageId }).pipe(
            map((response: User) => response),
            tap((user: User) => {
                return user;
            })
        );
    }
}
