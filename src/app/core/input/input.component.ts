import { Component, OnInit } from "@angular/core";
import { Message } from "../../models/Message";
import { WebsocketService } from "../../context/WebsocketService";

@Component({
    selector: "discord-clone-input",
    templateUrl: "./input.component.html",
    styleUrls: ["./input.component.css"]
})
export class InputComponent implements OnInit {
    message: Message = new Message(1, "", new Date(), "Chihi");
    content: string | null | undefined;

    constructor(private WebsocketService: WebsocketService) {}

    ngOnInit() {
        const length = document.getElementsByClassName("line").length;
        if (length == 0) {
            this.addLine();
        }

        document.getElementById("input")?.addEventListener("keydown", (evt) => {
            /**
             @todo: Fix copy pasting and focus on new line
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
        if (this.message.content == "") return;
        this.WebsocketService.sendMessage(this.message);
        this.message.content = "";
    }

    getContent() {
        return document.getElementById("input")?.textContent;
    }

    formatContent() {
        const elements = document.getElementsByClassName("line");
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

        div.classList.add("line");
        div.setAttribute("contenteditable", "true");

        document.getElementById("input")?.appendChild(div);
    }
}
