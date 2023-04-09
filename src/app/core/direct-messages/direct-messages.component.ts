import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { User } from "../../models/User";
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
    listStatus = "All";
    friends: User[] = [];
    pendingList: User[] = [];
    blockedList: User[] = [];
    subscription: Subscription;
    amountOfFriends = 0;

    constructor(
        private serverService: ServerService,
        private websocketService: WebsocketService
    ) {}

    ngOnInit() {
        this.user.friends.forEach((friend: any) => {
            this.subscription = this.serverService
                .getUserById(friend.user)
                .subscribe((user: User) => {
                    if (friend.status === "Pending") {
                        this.pendingList.push(user);
                    } else if (friend.status === "Blocked") {
                        this.blockedList.push(user);
                    }
                });

            this.websocketService.onStatusChange().subscribe((data: any) => {
                this.user.friendsList.forEach((user) => {
                    console.log(user);

                    if (user._id === data.userId) {
                        user.status = data.status;
                        this.filterFriends(this.listStatus);
                    }
                });
            });
        });

        this.websocketService.onDisplayStatusChange().subscribe((data) => {
            this.user.friendsList.forEach((user) => {
                if (user._id === data._id) {
                    user.displayedStatus = data.displayedStatus;
                    this.filterFriends(this.listStatus);
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
}
