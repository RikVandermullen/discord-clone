import { Component, Input, OnInit } from "@angular/core";
import { User } from "../../models/User";
import { Status } from "../../models/Status";
import { FriendStatus } from "../../models/FriendStatus";
import { Server } from "../../models/Server";
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
    allowScrollToBottom = true;
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
        console.log(this.selectedFriend);
    }

    createDirectMessage(friend: User) {
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
}
