import { DatePipe } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
import { Message } from "../../models/Message";

@Component({
    selector: "discord-clone-message",
    templateUrl: "./message.component.html",
    styleUrls: ["./message.component.css"]
})
export class MessageComponent implements OnInit {
    @Input() message: Message;
    currentDate: number = Date.now();
    formattedDate: string;

    constructor(private datePipe: DatePipe) {}

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
}
