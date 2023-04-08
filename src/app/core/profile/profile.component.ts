/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Component, Input } from "@angular/core";
import { Status } from "src/app/models/Status";
import { ServerService } from "../server/server.service";
import { WebsocketService } from "src/app/context/WebsocketService";
import { User } from "src/app/models/User";

@Component({
    selector: "discord-clone-profile",
    templateUrl: "./profile.component.html",
    styleUrls: ["./profile.component.css"]
})
export class ProfileComponent {
    @Input() user: User;
    hideProfilePanel: boolean = false;

    constructor(
        private serverService: ServerService,
        private websocketService: WebsocketService
    ) {}

    setDisplayedStatus(status: string) {
        const statusEnum = Status[status as keyof typeof Status];
        this.user.displayedStatus = statusEnum;
        this.serverService
            .setUserDisplayedStatus(this.user._id, statusEnum)
            .subscribe();
        this.websocketService.setStatus(this.user);
    }
}
