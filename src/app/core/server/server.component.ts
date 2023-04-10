/* eslint-disable @nrwl/nx/enforce-module-boundaries */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    ViewChild
} from "@angular/core";
import { Server } from "../../models/Server";
import { WebsocketService } from "../../context/WebsocketService";
import { User } from "../../models/User";
import { Message } from "../../models/Message";
import { Status } from "../../models/Status";
import { ServerType } from "../../models/ServerType";
import { JwtPayload } from "jwt-decode";
import jwt_decode from "jwt-decode";
import { ServerService } from "./server.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Subscription } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { FriendStatus } from "src/app/models/FriendStatus";

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
            Status.Idle,
            new Map<null, null>(),
            [],
            []
        ),
        new Date(),
        [],
        new Map<string, string>(),
        [],
        ServerType.Server
    );
    servers: Server[] = [];
    directMessages: Server[] = [];
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
            Status.Idle,
            new Map<null, null>(),
            [],
            []
        ),
        new Date(),
        [],
        new Map<string, string>(),
        [],
        ServerType.Server
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
        Status.Online,
        new Map<null, null>(),
        [],
        []
    );
    hideMemberPanel: boolean = false;
    allowScrollToMessage: boolean = true;
    allowScrollToBottom: boolean = false;
    clearMessageInput: number = 0;
    subscription: Subscription;
    directMessagesOn: boolean = true;

    constructor(
        private websocketService: WebsocketService,
        private serverService: ServerService,
        private modalService: NgbModal,
        private route: ActivatedRoute
    ) {}

    async ngOnInit() {
        const decodedToken = jwt_decode<JwtPayload>(
            localStorage.getItem("currentuser")!
        );
        this.user = JSON.parse(JSON.stringify(decodedToken)).user;

        const id = this.route.snapshot.params["id"];

        if (id === "@me") {
            this.directMessagesOn = true;
            this.allowScrollToMessage = false;
        } else {
            this.directMessagesOn = false;
        }

        this.subscription = this.serverService
            .setUserOnline(this.user._id)
            .subscribe();

        this.subscription = this.serverService
            .getUserById(this.user._id)
            .subscribe((user: User) => {
                this.user = user;
                this.newServer.owner = user;
                this.user.friendsList = [];
                this.user.friends.forEach((friend: any) => {
                    if (friend.status === FriendStatus.Accepted) {
                        this.subscription = this.serverService
                            .getUserById(friend.user)
                            .subscribe((user: User) => {
                                this.user.friendsList.push(user);
                            });
                    }
                });
                this.websocketService
                    .onStatusChange()
                    .subscribe((data: any) => {
                        this.user.friendsList.forEach((user) => {
                            if (user._id === data.userId) {
                                user.status = data.status;
                            }
                        });
                    });
            });

        this.subscription = this.serverService
            .getServerByUserId(this.user._id)
            .subscribe((servers: Server[]) => {
                servers.forEach((server) => {
                    if (server.type === ServerType.Server) {
                        this.servers.push(server);
                    }
                    // else if (server.type === ServerType.DirectMessage) {
                    //     if (server.users[0]._id !== this.user._id) {
                    //         const temp = server.users[0];
                    //         server.users[0] = this.user;
                    //         server.users[1] = temp;
                    //     }
                    //     this.directMessages.push(server);
                    // }
                });
                if (!this.directMessages) {
                    this.selectServer(this.servers[0]);
                }
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
        this.newServer.users = [this.user];
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
        this.directMessagesOn = false;
        this.subscription = this.serverService
            .getServerById(server._id)
            .subscribe((server) => {
                this.selectedServer.users = server.users;
                this.selectedServer.lastMessageRead = server.lastMessageRead;
            });
        this.selectedServer = server;
        this.clearMessageInput = 0;
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
                .setLastReadMessage(this.selectedServer._id, this.user._id)
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
        setTimeout(() => {
            if (status && this.directMessagesOn === false) {
                this.messageContainer.nativeElement.addEventListener(
                    "mousewheel",
                    () => {
                        if (
                            this.messageContainer.nativeElement.scrollTop +
                                this.messageContainer.nativeElement
                                    .clientHeight ===
                            this.messageContainer.nativeElement.scrollHeight
                        ) {
                            this.allowScrollToBottom = true;
                        } else {
                            this.allowScrollToBottom = false;
                        }
                    }
                );
            }
        }, 100);
    }

    selectDirectMessages() {
        if (this.directMessagesOn) return;
        this.directMessagesOn = !this.directMessagesOn;
        this.selectedServer = this.newServer;
    }
}
