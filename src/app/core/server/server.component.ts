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

@Component({
    selector: "discord-clone-server",
    templateUrl: "./server.component.html",
    styleUrls: ["./server.component.css"]
})
export class ServerComponent implements OnInit, AfterViewChecked {
    @ViewChild("messageContainer") private messageContainer: ElementRef;

    servers: Server[] = [
        new Server(
            0,
            "Server 1",
            [
                new User(
                    0,
                    "chihi@mail.com",
                    "Chihi",
                    "Secret",
                    new Date(),
                    Status.Idle
                ),
                new User(
                    0,
                    "chihi@mail.com",
                    "Chihi2",
                    "Secret",
                    new Date(),
                    Status.Offline
                )
            ],
            [
                new Message(0, "Hello", new Date(), "Chihi"),
                new Message(1, "Hi", new Date(), "Chihi 2")
            ]
        ),
        new Server(
            1,
            "Server 2",
            [
                new User(
                    0,
                    "chihi@mail.com",
                    "Chihi",
                    "Secret",
                    new Date(),
                    Status.Idle
                )
            ],
            []
        ),
        new Server(2, "Server 3", [], [])
    ];
    selectedServer: Server = this.servers[0];
    user: User = new User(
        0,
        "chihi@mail.com",
        "Chihi",
        "Secret",
        new Date(),
        Status.Online
    );
    subscription: Subscription;

    constructor(private websocketService: WebsocketService) {}

    ngOnInit() {
        this.servers.forEach((server) => {
            this.websocketService.joinRoom(server.name, this.user.userName);
        });

        this.subscription = this.websocketService
            .onNewMessage()
            .subscribe((data) => {
                this.servers.forEach((server) => {
                    if (server.name === data.room) {
                        server.messages.push(data);
                    }
                });
            });
    }

    createServer() {
        const server: Server = new Server(3, "Server 4", [this.user], []);
        this.websocketService.createRoom(server.name, this.user.userName);
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
