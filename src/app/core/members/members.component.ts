import { Component, Input, OnChanges, OnInit } from "@angular/core";
import { User } from "../../models/User";

@Component({
    selector: "discord-clone-members",
    templateUrl: "./members.component.html",
    styleUrls: ["./members.component.css"]
})
export class MembersComponent implements OnInit, OnChanges {
    @Input() users: User[];
    onlineUsers: User[];
    offlineUsers: User[];

    ngOnInit() {
        this.sortUsers();
    }

    ngOnChanges() {
        this.sortUsers();
    }

    sortUsers() {
        this.onlineUsers = this.users.filter(
            (user) =>
                user.status === "Online" ||
                user.status === "Idle" ||
                user.status === "Do Not Disturb"
        );
        this.offlineUsers = this.users.filter(
            (user) => user.status === "Offline"
        );
    }
}
