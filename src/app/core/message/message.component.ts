/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import { DatePipe } from "@angular/common";
import {
    AfterViewChecked,
    AfterViewInit,
    Component,
    ElementRef,
    Input,
    OnChanges,
    OnInit,
    ViewChild
} from "@angular/core";
import { User } from "../../models/User";
import { WebsocketService } from "../../context/WebsocketService";
import { Message } from "../../models/Message";
import { JwtPayload } from "jwt-decode";
import jwt_decode from "jwt-decode";

@Component({
    selector: "discord-clone-message",
    templateUrl: "./message.component.html",
    styleUrls: ["./message.component.css"]
})
export class MessageComponent implements OnInit {
    @Input() message: Message;
    @ViewChild("messageId") messageId: ElementRef;
    currentDate: number = Date.now();
    formattedDate: string;
    editMode: boolean = false;
    currentUser: User;

    constructor(
        private datePipe: DatePipe,
        private websocketService: WebsocketService
    ) {}

    ngOnInit() {
        const decodedToken = jwt_decode<JwtPayload>(
            localStorage.getItem("currentuser")!
        );
        this.currentUser = JSON.parse(JSON.stringify(decodedToken)).user;

        this.formattedDate = this.formatDate();
    }

    formatDate(): string {
        const dateToFormat = new Date(this.message.date_created).valueOf();
        const date = new Date(dateToFormat).getDate();
        const dateToDisplay = new Date(dateToFormat);
        const currentDate = new Date(this.currentDate).getDate();
        if (date == currentDate) {
            return (
                "Today at " + this.datePipe.transform(dateToDisplay, "HH:mm")
            );
        } else if (date == currentDate - 1) {
            return (
                "Yesterday at " +
                this.datePipe.transform(dateToDisplay, "HH:mm")
            );
        } else {
            return (
                "" + this.datePipe.transform(dateToDisplay, "dd-MM-yyyy HH:mm")
            );
        }
    }

    deleteMessage() {
        this.websocketService.deleteMessage(this.message);
    }

    editMessage() {
        this.editMode = true;
        setTimeout(() => {
            const content: string[] = this.message.content.split("\n");
            content.forEach((line, index) => {
                if (index !== content.length - 1) {
                    this.messageId.nativeElement.appendChild(
                        this.addLine(line)
                    );
                }
            });

            this.messageId.nativeElement.addEventListener(
                "keydown",
                (evt: any) => {
                    if (evt.key === "Escape") {
                        this.editMode = false;
                    }

                    if (evt.shiftKey && evt.key === "Enter") {
                        evt.preventDefault();
                        this.messageId.nativeElement.appendChild(
                            this.addLine("")
                        );
                    }

                    if (evt.key === "Enter" && !evt.shiftKey) {
                        this.formatContent();
                        this.saveMessage();
                        evt.preventDefault();
                    }
                }
            );
        }, 100);
    }

    saveMessage() {
        this.websocketService.editMessage(this.message);
    }

    addLine(content: string) {
        const div = document.createElement("div");
        const br = document.createElement("br");

        div.textContent = content;
        div.appendChild(br);

        div.classList.add("line");
        div.setAttribute("contenteditable", "true");
        return div;
    }

    formatContent() {
        this.message.content = "";
        const elements = document.getElementsByClassName("line");
        Array.from(elements).forEach((element: Element, index) => {
            if (index !== elements.length - 1) {
                this.message.content += element.textContent + "\n";
            } else {
                this.message.content += element.textContent;
            }
        });
    }
}
