/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Component, Input, OnInit } from "@angular/core";
import { Status } from "src/app/models/Status";
import { ServerService } from "../server/server.service";
import { WebsocketService } from "src/app/context/WebsocketService";
import { User } from "src/app/models/User";
import { Subscription } from "rxjs";

@Component({
    selector: "discord-clone-profile",
    templateUrl: "./profile.component.html",
    styleUrls: ["./profile.component.css"]
})
export class ProfileComponent implements OnInit {
    @Input() user: User;
    hideProfilePanel: boolean = false;
    subscription: Subscription;

    constructor(
        private serverService: ServerService,
        private websocketService: WebsocketService
    ) {}

    ngOnInit() {
        this.websocketService
            .onDisplayStatusChange()
            .subscribe((user: User) => {
                if (user._id === this.user._id) {
                    this.user.displayedStatus = user.displayedStatus;
                }
            });
        this.websocketService.onStatusChange().subscribe((user: User) => {
            if (user._id === this.user._id) {
                this.user.status = user.status;
            }
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
}
