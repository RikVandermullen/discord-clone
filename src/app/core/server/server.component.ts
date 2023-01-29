/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
    AfterViewChecked,
    Component,
    ElementRef,
    HostListener,
    OnChanges,
    OnDestroy,
    OnInit,
    ViewChild
} from "@angular/core";
import { Server } from "../../models/Server";
import { WebsocketService } from "../../context/WebsocketService";
import { User } from "../../models/User";
import { Message } from "../../models/Message";
import { Status } from "../../models/Status";
import { fromEvent, Subscription } from "rxjs";
import { JwtPayload } from "jwt-decode";
import jwt_decode from "jwt-decode";
import { ServerService } from "./server.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { environment } from "../../../environments/environment";

@Component({
    selector: "discord-clone-server",
    templateUrl: "./server.component.html",
    styleUrls: ["./server.component.css"]
})
export class ServerComponent implements OnInit, OnDestroy {
    @ViewChild("messageContainer") private messageContainer: ElementRef;
    newServer: Server = new Server(
        "",
        "",
        new User(
            "0",
            "",
            "",
            "",
            new Date(),
            new Date(),
            Status.Idle,
            Status.Idle
        ),
        new Date(),
        [],
        new Map<string, string>(),
        []
    );
    servers: Server[] = [];
    serverToJoin: Server = new Server(
        "",
        "",
        new User(
            "0",
            "",
            "",
            "",
            new Date(),
            new Date(),
            Status.Idle,
            Status.Idle
        ),
        new Date(),
        [],
        new Map<string, string>(),
        []
    );
    selectedServer: Server;
    user: User = new User(
        "",
        "",
        "",
        "",
        new Date(),
        new Date(),
        Status.Online,
        Status.Online
    );
    hideMemberPanel: boolean = false;
    hideProfilePanel: boolean = false;
    allowScrollToMessage: boolean = true;
    allowScrollToBottom: boolean = false;
    clearMessageInput: number = 0;
    subscription: Subscription;

    constructor(
        private websocketService: WebsocketService,
        private serverService: ServerService,
        private modalService: NgbModal
    ) {}

    async ngOnInit() {
        const decodedToken = jwt_decode<JwtPayload>(
            localStorage.getItem("currentuser")!
        );
        this.user = JSON.parse(JSON.stringify(decodedToken)).user;

        this.subscription = this.serverService
            .setUserOnline(this.user._id)
            .subscribe();

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
                this.selectServer(this.servers[0]);
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
                        server.newMessage = true;
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
                this.selectedServer.lastMessageRead = server.lastMessageRead;
            });
        this.selectedServer = server;
        if (this.getLastMessage() === "") {
            console.log("No messages");

            this.allowScrollToBottom = true;
            this.allowScrollToMessage = false;
        } else {
            this.allowScrollToBottom = false;
            this.allowScrollToMessage = true;
        }
    }

    ngAfterViewChecked() {
        if (this.allowScrollToMessage) {
            this.scrollToMessage();
        } else if (this.allowScrollToBottom) {
            this.scrollToBottom();
        }

        if (this.clearMessageInput === 1) {
            this.serverService
                .setLastReadMessage(this.selectedServer._id, this.user._id, "")
                .subscribe();
        }
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    scrollToMessage(): void {
        if (!this.selectedServer) return;
        const lastMessage = this.getLastMessage();

        const container = this.messageContainer.nativeElement;
        const message = container.querySelectorAll(
            "div #message-" + lastMessage
        );

        try {
            this.messageContainer.nativeElement.scrollTop =
                message[0].offsetTop - 105;

            this.allowScrollToMessage = false;
            // eslint-disable-next-line no-empty
        } catch (err) {}
    }

    scrollToBottom(): void {
        if (!this.selectedServer) return;
        try {
            this.messageContainer.nativeElement.scrollTop =
                this.messageContainer.nativeElement.scrollHeight;
            this.allowScrollToBottom = true;
            this.selectedServer.newMessage = false;
            this.clearMessageInput++;
            // eslint-disable-next-line no-empty
        } catch (err) {}
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

    setDisplayedStatus(status: string) {
        const statusEnum = Status[status as keyof typeof Status];
        this.user.displayedStatus = statusEnum;
        this.serverService
            .setUserDisplayedStatus(this.user._id, statusEnum)
            .subscribe();
        this.websocketService.setStatus(this.user);
    }

    getLastMessage() {
        let lastMessagesRead: any = [];
        lastMessagesRead = JSON.parse(
            JSON.stringify(this.selectedServer.lastMessageRead)
        );
        let lastMessage = "";
        lastMessagesRead.forEach((message: any) => {
            if (message.user === this.user._id) {
                lastMessage = message.message;
            }
        });
        return lastMessage;
    }

    getEditStatus(status: boolean) {
        if (status) {
            this.allowScrollToBottom = false;
        }
    }

    getScrollStatus(status: boolean) {
        if (status) {
            this.messageContainer.nativeElement.addEventListener(
                "mousewheel",
                () => {
                    if (
                        this.messageContainer.nativeElement.scrollTop +
                            this.messageContainer.nativeElement.clientHeight ===
                        this.messageContainer.nativeElement.scrollHeight
                    ) {
                        this.allowScrollToBottom = true;
                    } else {
                        this.allowScrollToBottom = false;
                    }
                }
            );
        }
    }
}
