/* eslint-disable @nrwl/nx/enforce-module-boundaries */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Component, Input, OnChanges, OnInit } from "@angular/core";
import { Message } from "../../models/Message";
import { WebsocketService } from "../../context/WebsocketService";
import { JwtPayload } from "jwt-decode";
import jwt_decode from "jwt-decode";
import { User } from "../../models/User";
import { Status } from "../../models/Status";
import { ServerService } from "../server/server.service";
import { FriendStatus } from "src/app/models/FriendStatus";

@Component({
    selector: "discord-clone-input",
    templateUrl: "./input.component.html",
    styleUrls: ["./input.component.css"]
})
export class InputComponent implements OnInit, OnChanges {
    @Input() currentServer: string | null;
    message: Message = new Message(
        "1",
        "",
        new Date(),
        new User(
            "0",
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
        ),
        false
    );
    content: string | null | undefined;

    constructor(private WebsocketService: WebsocketService) {}

    ngOnInit() {
        const decodedToken = jwt_decode<JwtPayload>(
            localStorage.getItem("currentuser")!
        );
        this.message.author = JSON.parse(JSON.stringify(decodedToken)).user;

        const length = document.getElementsByClassName("line").length;
        if (length == 0) {
            this.addLine();
        }

        this.setServer();

        document.getElementById("input")?.addEventListener("keydown", (evt) => {
            /**
             @todo: Fix copy pasting and focus on new line
             @todo: Add file support
            **/

            if (evt.shiftKey && evt.key === "Enter") {
                evt.preventDefault();
                this.addLine();
            }

            if (evt.key === "Enter" && !evt.shiftKey) {
                this.formatContent();
                this.sendMessage();
                this.clearContent();
                evt.preventDefault();
            }
        });
    }

    sendMessage() {
        if (document.getElementById("input")?.textContent === "") {
            this.clearContent();
            this.message.content = "";
            return;
        } else {
            /**
             @todo: Error handling
            **/
            this.setServer();
            console.log(this.message);

            this.WebsocketService.sendMessage(this.message);
            this.message.content = "";
        }
    }

    getContent() {
        return document.getElementById("input")?.textContent;
    }

    formatContent() {
        const elements = document.getElementsByClassName("lineNew");
        Array.from(elements).forEach((element: Element) => {
            this.message.content += element.textContent + "\n";
        });
    }

    clearContent() {
        const input = document.getElementById("input");
        if (input) {
            input.innerHTML = "";
        }
        this.addLine();
    }

    addLine() {
        const div = document.createElement("div");
        const br = document.createElement("br");

        div.appendChild(br);

        div.classList.add("lineNew");
        div.setAttribute("contenteditable", "true");

        document.getElementById("input")?.appendChild(div);
    }

    setServer() {
        if (this.currentServer) {
            this.message.server = this.currentServer;
        }
    }

    ngOnChanges() {
        this.setServer();
    }
}
