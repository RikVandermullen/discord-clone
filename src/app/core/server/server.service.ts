import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Message } from "../../models/Message";
import { environment } from "../../../environments/environment";
import { map, tap } from "rxjs";

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
}
