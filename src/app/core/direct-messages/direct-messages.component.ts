import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { User } from "../../models/User";
import { ServerService } from "../server/server.service";
import { Subscription } from "rxjs";

@Component({
    selector: "discord-clone-direct-messages",
    templateUrl: "./direct-messages.component.html",
    styleUrls: ["./direct-messages.component.css"]
})
export class DirectMessagesComponent implements OnInit, OnDestroy {
    @Input() user: User;
    listStatus = "All";
    friends: User[] = [];
    pendingList: User[] = [];
    blockedList: User[] = [];
    subscription: Subscription;

    constructor(private serverService: ServerService) {}

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
        });
    }

    filterFriends(status?: string) {
        if (!status) {
            this.listStatus = "All";
            this.friends = this.user.friendsList;
            return;
        } else if (status === "Online") {
            this.listStatus = "Online";
            this.friends = this.user.friendsList.filter(
                (friend: User) =>
                    friend.status === "Online" ||
                    friend.status === "Idle" ||
                    friend.status === "Do Not Disturb"
            );
        } else if (status === "Pending") {
            this.listStatus = "Pending";
            this.friends = this.pendingList;
        } else if (status === "Blocked") {
            this.listStatus = "Blocked";
            this.friends = this.blockedList;
        }
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
