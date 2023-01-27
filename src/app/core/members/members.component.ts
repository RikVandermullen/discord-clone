import { Component, Input, OnChanges, OnInit } from "@angular/core";
import { WebsocketService } from "../../context/WebsocketService";
import { User } from "../../models/User";

@Component({
    selector: "discord-clone-members",
    templateUrl: "./members.component.html",
    styleUrls: ["./members.component.css"]
})
export class MembersComponent implements OnInit, OnChanges {
    @Input() users: User[];
    foundUsers: User[];
    onlineUsers: User[];
    offlineUsers: User[];

    constructor(private websocketService: WebsocketService) {}

    ngOnInit() {
        this.sortUsers();

        this.websocketService.onStatusChange().subscribe((data) => {
            this.users.forEach((user) => {
                if (user._id === data._id) {
                    user.status = data.status;
                    this.sortUsers();
                }
            });
        });
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
