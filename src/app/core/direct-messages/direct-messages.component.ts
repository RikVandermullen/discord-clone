/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { User } from "../../models/User";
import { Status } from "../../models/Status";
import { FriendStatus } from "../../models/FriendStatus";
import { Server } from "../../models/Server";
import { Message } from "../../models/Message";
import { ServerType } from "../../models/ServerType";
import { ServerService } from "../server/server.service";
import { Subscription } from "rxjs";
import { WebsocketService } from "../../context/WebsocketService";

@Component({
    selector: "discord-clone-direct-messages",
    templateUrl: "./direct-messages.component.html",
    styleUrls: ["./direct-messages.component.css"]
})
export class DirectMessagesComponent implements OnInit {
    @Input() user: User;
    @Input() directMessages: Server[];
    @ViewChild("directMessageContainer") private messageContainer: ElementRef;
    listStatus = "All";
    friends: User[] = [];
    pendingList: User[] = [];
    blockedList: User[] = [];
    subscription: Subscription;
    amountOfFriends = 0;
    showFriends = true;
    selectedFriend: User = new User(
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
        ServerType.DirectMessage
    );
    selectedDirectMessage: Server;
    allowScrollToMessage: boolean = true;
    allowScrollToBottom: boolean = false;
    clearMessageInput: number = 0;
    directMessagesOn: boolean = true;

    constructor(
        private serverService: ServerService,
        private websocketService: WebsocketService
    ) {}

    ngOnInit() {
        this.subscription = this.serverService
            .getUserById(this.user._id)
            .subscribe((user: User) => {
                this.user = user;
                this.newServer.owner = user;
                this.user.friendsList = [];
                this.user.friends.forEach((friend: any) => {
                    this.subscription = this.serverService
                        .getUserById(friend.user)
                        .subscribe((user: User) => {
                            if (friend.status === FriendStatus.Pending) {
                                this.pendingList.push(user);
                            } else if (friend.status === FriendStatus.Blocked) {
                                this.blockedList.push(user);
                            } else {
                                this.user.friendsList.push(user);
                            }
                        });
                    this.friends = this.user.friendsList;
                    this.amountOfFriends = this.filterFriends.length;
                    this.filterFriends(this.listStatus);
                });

                this.websocketService
                    .onStatusChange()
                    .subscribe((data: any) => {
                        this.user.friendsList.forEach((user) => {
                            if (user._id === data.userId) {
                                user.status = data.status;
                                this.filterFriends(this.listStatus);
                            }
                        });
                        this.directMessages.forEach((server) => {
                            server.users.forEach((user) => {
                                if (user._id === data.userId) {
                                    user.status = data.status;
                                }
                            });
                        });
                    });

                this.websocketService
                    .onDisplayStatusChange()
                    .subscribe((data) => {
                        this.user.friendsList.forEach((user) => {
                            if (user._id === data._id) {
                                user.displayedStatus = data.displayedStatus;
                                this.filterFriends(this.listStatus);
                            }
                        });

                        this.directMessages.forEach((server) => {
                            server.users.forEach((user) => {
                                if (user._id === data._id) {
                                    user.displayedStatus = data.displayedStatus;
                                }
                            });
                        });
                    });
            });

        this.subscription = this.serverService
            .getServerByUserId(this.user._id)
            .subscribe((servers: Server[]) => {
                servers.forEach((server) => {
                    if (server.type === ServerType.DirectMessage) {
                        if (server.users[0]._id !== this.user._id) {
                            const temp = server.users[0];
                            server.users[0] = this.user;
                            server.users[1] = temp;
                        }
                        if (
                            this.directMessages.filter(
                                (s) => s._id === server._id
                            ).length === 0
                        ) {
                            this.directMessages.push(server);
                        }
                    }
                });
                this.selectedDirectMessage = this.directMessages[0];
                this.directMessages.forEach((server) => {
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
                this.directMessages.forEach((server) => {
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

                this.directMessages.forEach((server) => {
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

                this.directMessages.forEach((server) => {
                    if (server._id === data.server) {
                        server.messages = server.messages.map((message) =>
                            message._id === data._id ? data : message
                        );
                    }
                });
            });
    }

    filterFriends(status?: string) {
        if (!status) {
            this.listStatus = "All";
            this.amountOfFriends = this.user.friendsList.length;
            this.friends = this.user.friendsList;
            return;
        } else if (status === "Online") {
            this.listStatus = "Online";
            this.amountOfFriends = this.getFriendAmount("Online");
            this.friends = this.user.friendsList.filter(
                (friend: User) =>
                    friend.displayedStatus === "Online" ||
                    friend.displayedStatus === "Idle" ||
                    friend.displayedStatus === "Do Not Disturb"
            );
        } else if (status === "Pending") {
            this.listStatus = "Pending";
            this.amountOfFriends = this.getFriendAmount("Pending");
            this.friends = this.pendingList;
        } else if (status === "Blocked") {
            this.listStatus = "Blocked";
            this.amountOfFriends = this.getFriendAmount("Blocked");
            this.friends = this.blockedList;
        }
    }

    getFriendAmount(status?: string): number {
        if (status === "Online") {
            return this.user.friendsList.filter(
                (friend: User) =>
                    friend.displayedStatus === "Online" ||
                    friend.displayedStatus === "Idle" ||
                    friend.displayedStatus === "Do Not Disturb"
            ).length;
        } else if (status === "Pending") {
            return this.pendingList.length;
        } else if (status === "Blocked") {
            return this.blockedList.length;
        } else {
            return this.user.friendsList.length;
        }
    }

    selectFriend(server: Server) {
        this.showFriends = false;
        this.selectedFriend = server.users.filter(
            (user) => user._id !== this.user._id
        )[0];
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

    createDirectMessage(friend: User) {
        if (this.checkIfDirectMessageExists(friend)) {
            this.selectedDirectMessage = this.directMessages.filter(
                (server) => server.users[1]._id === friend._id
            )[0];
            this.selectFriend(this.selectedDirectMessage);
            this.showFriends = false;
            return;
        }

        this.newServer.owner = this.user;
        this.newServer.name = "Messages-" + this.user._id + "-" + friend._id;
        this.newServer.users.push(this.user);
        this.newServer.users.push(friend);

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
                        this.directMessages.push(server);
                        this.selectedDirectMessage = server;
                    });
            });
    }

    checkIfDirectMessageExists(friend: User): boolean {
        return (
            this.directMessages.filter(
                (server) =>
                    server.users.filter((user) => user._id === friend._id)
                        .length > 0
            ).length > 0
        );
    }

    ngAfterViewChecked() {
        if (this.allowScrollToMessage) {
            this.scrollToMessage();
        } else if (this.allowScrollToBottom) {
            this.scrollToBottom();
        }

        if (this.clearMessageInput === 1) {
            this.serverService
                .setLastReadMessage(
                    this.selectedDirectMessage._id,
                    this.user._id
                )
                .subscribe();
        }
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    scrollToMessage(): void {
        if (this.showFriends) return;
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
        if (this.showFriends) return;
        try {
            this.messageContainer.nativeElement.scrollTop =
                this.messageContainer.nativeElement.scrollHeight;
            this.allowScrollToBottom = true;
            this.selectedDirectMessage.newMessage = false;
            this.clearMessageInput++;
            // eslint-disable-next-line no-empty
        } catch (err) {}
    }

    getLastMessage() {
        let lastMessagesRead: any = [];
        lastMessagesRead = JSON.parse(
            JSON.stringify(this.selectedDirectMessage.lastMessageRead)
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
            if (status && this.directMessagesOn === true) {
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
}
