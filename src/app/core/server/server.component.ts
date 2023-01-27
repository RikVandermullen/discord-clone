/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
    AfterViewChecked,
    Component,
    ElementRef,
    OnChanges,
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
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: "discord-clone-server",
    templateUrl: "./server.component.html",
    styleUrls: ["./server.component.css"]
})
export class ServerComponent implements OnInit {
    @ViewChild("messageContainer") private messageContainer: ElementRef;
    newServer: Server = new Server(
        "",
        "",
        new User("0", "", "", "", new Date(), new Date(), Status.Idle),
        new Date(),
        [],
        []
    );
    servers: Server[] = [];
    serverToJoin: Server = new Server(
        "",
        "",
        new User("0", "", "", "", new Date(), new Date(), Status.Idle),
        new Date(),
        [],
        []
    );
    selectedServer: Server = new Server(
        "",
        "",
        new User("0", "", "", "", new Date(), new Date(), Status.Idle),
        new Date(),

        [],
        []
    );
    user: User = new User(
        "",
        "",
        "",
        "",
        new Date(),
        new Date(),
        Status.Online
    );
    hideMemberPanel: boolean = false;
    hideProfilePanel: boolean = false;
    subscription: Subscription;

    constructor(
        private websocketService: WebsocketService,
        private serverService: ServerService,
        private modalService: NgbModal
    ) {}

    ngOnInit() {
        const decodedToken = jwt_decode<JwtPayload>(
            localStorage.getItem("currentuser")!
        );
        this.user = JSON.parse(JSON.stringify(decodedToken)).user;

        this.subscription = this.serverService
            .getUserById(this.user._id)
            .subscribe((user: User) => {
                this.user = user;
                this.newServer.owner = user;
            });

        this.subscription = this.serverService
            .getServerByUserId(this.user._id)
            .subscribe((servers: Server[]) => {
                this.servers = servers;
                this.selectedServer = this.servers[0];
                this.servers.forEach((server) => {
                    this.serverService
                        .getMessagesByServerId(server._id)
                        .subscribe((messages: Message[]) => {
                            server.messages = messages;
                        });
                    this.websocketService.joinServer(
                        server._id,
                        this.user.userName
                    );
                });
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

        this.subscription = this.websocketService
            .onDeletedMessage()
            .subscribe((data) => {
                console.log("Deleted message: " + data._id);

                this.servers.forEach((server) => {
                    if (server._id === data.server) {
                        server.messages = server.messages.filter(
                            (message) => message._id !== data._id
                        );
                    }
                });
            });

        this.subscription = this.websocketService
            .onEditedMessage()
            .subscribe((data) => {
                console.log("Edited message: " + data._id);

                this.servers.forEach((server) => {
                    if (server._id === data.server) {
                        server.messages = server.messages.map((message) =>
                            message._id === data._id ? data : message
                        );
                    }
                });
            });
    }

    createServer() {
        this.serverService
            .createServer(this.newServer)
            .subscribe((response) => {
                this.serverService
                    .getServerById(response._id)
                    .subscribe((server) => {
                        this.websocketService.joinServer(
                            server._id,
                            this.user.userName
                        );
                        server.messages = [];
                        this.servers.push(server);
                        this.selectedServer = server;
                    });
            });
        this.modalService.dismissAll();
    }

    joinServer() {
        this.subscription = this.serverService
            .joinServer(this.serverToJoin._id, this.user._id)
            .subscribe();
        this.serverService
            .getServerById(this.serverToJoin._id)
            .subscribe((server) => {
                this.websocketService.joinServer(
                    server._id,
                    this.user.userName
                );
                this.serverService
                    .getMessagesByServerId(server._id)
                    .subscribe((messages: Message[]) => {
                        server.messages = messages;
                    });
                this.servers.push(server);
                this.selectedServer = server;
            });
    }

    selectServer(server: Server) {
        this.subscription = this.serverService
            .getServerById(server._id)
            .subscribe((server) => {
                this.selectedServer.users = server.users;
            });
        this.selectedServer = server;
    }
    /**
     @todo: Fix scroll to bottom to work with updated messages
    **/
    // ngAfterViewChecked() {
    //     this.scrollToBottom();
    // }

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

    hideMembers() {
        this.hideMemberPanel = !this.hideMemberPanel;
    }

    openCreate(content: any) {
        this.modalService.open(content, {
            ariaLabelledBy: "create-modal"
        });
    }

    openJoin(content: any) {
        this.modalService.open(content, {
            ariaLabelledBy: "join-modal"
        });
    }

    setStatus(status: string) {
        const statusEnum = Status[status as keyof typeof Status];
        this.user.status = statusEnum;
        this.serverService.setUserStatus(this.user._id, statusEnum).subscribe();
        this.websocketService.setStatus(this.user);
    }
}
