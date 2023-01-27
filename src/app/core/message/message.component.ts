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
import { WebsocketService } from "../../context/WebsocketService";
import { Message } from "../../models/Message";

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

    constructor(
        private datePipe: DatePipe,
        private websocketService: WebsocketService
    ) {}

    ngOnInit() {
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
            this.messageId.nativeElement.addEventListener(
                "keydown",
                (evt: any) => {
                    if (evt.key === "Enter") {
                        this.saveMessage();
                    }
                    if (evt.key === "Escape") {
                        this.editMode = false;
                    }
                }
            );
        }, 100);
    }

    saveMessage() {
        this.websocketService.editMessage(this.message);
    }
}
