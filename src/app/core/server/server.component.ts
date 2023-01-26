/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
    AfterViewChecked,
    Component,
    ElementRef,
    OnInit,
    ViewChild
} from "@angular/core";
import { Server } from "../../models/Server";
import { WebsocketService } from "../../context/WebsocketService";
import { User } from "../../models/User";
import { Message } from "../../models/Message";
import { Status } from "../../models/Status";
import { Subscription } from "rxjs";
import { JwtPayload } from "jwt-decode";
import jwt_decode from "jwt-decode";
import { ServerService } from "./server.service";

@Component({
    selector: "discord-clone-server",
    templateUrl: "./server.component.html",
    styleUrls: ["./server.component.css"]
})
export class ServerComponent implements OnInit, AfterViewChecked {
    @ViewChild("messageContainer") private messageContainer: ElementRef;

    servers: Server[] = [
        new Server(
            "63d2d639abaa37742196819b",
            "Server 1",
            [
                new User(
                    "0",
                    "chihi@mail.com",
                    "Chihi",
                    "Secret",
                    new Date(),
                    Status.Idle
                ),
                new User(
                    "0",
                    "chihi@mail.com",
                    "Chihi2",
                    "Secret",
                    new Date(),
                    Status.Offline
                )
            ],
            []
        ),
        new Server(
            "63d2d639abaa37742196819a",
            "Server 2",
            [
                new User(
                    "0",
                    "chihi@mail.com",
                    "Chihi",
                    "Secret",
                    new Date(),
                    Status.Idle
                )
            ],
            []
        ),
        new Server("63d2d639abaa37742196819c", "Server 3", [], [])
    ];
    selectedServer: Server = this.servers[0];
    user: User = new User(
        "0",
        "chihi@mail.com",
        "Chihi",
        "Secret",
        new Date(),
        Status.Online
    );
    subscription: Subscription;

    constructor(
        private websocketService: WebsocketService,
        private serverService: ServerService
    ) {}

    ngOnInit() {
        const decodedToken = jwt_decode<JwtPayload>(
            localStorage.getItem("currentuser")!
        );
        this.user = JSON.parse(JSON.stringify(decodedToken)).user;

        this.servers.forEach((server) => {
            this.serverService
                .getMessagesByServerId(server._id)
                .subscribe((messages: Message[]) => {
                    server.messages = messages;
                });
            this.websocketService.joinServer(server._id, this.user.userName);
        });

        this.subscription = this.websocketService
            .onNewMessage()
            .subscribe((data) => {
                this.servers.forEach((server) => {
                    if (server._id === data.server) {
                        server.messages.push(data);
                    }
                });
            });
    }

    createServer() {
        const server: Server = new Server("3", "Server 4", [this.user], []);
        this.websocketService.createServer(server.name, this.user.userName);
        this.servers.push(server);
    }

    selectServer(server: Server) {
        this.selectedServer = server;
    }

    ngAfterViewChecked() {
        this.scrollToBottom();
    }

    onDestroy() {
        this.subscription.unsubscribe();
    }

    scrollToBottom(): void {
        try {
            this.messageContainer.nativeElement.scrollTop =
                this.messageContainer.nativeElement.scrollHeight;
        } catch (err) {
            console.log(err);
        }
    }
}
