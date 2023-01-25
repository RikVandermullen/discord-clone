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

    ngOnInit() {
        this.formattedDate = this.formatDate();
    }

    formatDate(): string {
        const dateToFormat = new Date(this.message.date).valueOf();
        const date = new Date(dateToFormat).getDate();
        const dateToDisplay = new Date(dateToFormat);
        const currentDate = new Date(this.currentDate).getDate();
        if (date == currentDate) {
            return (
                "Today at " +
                dateToDisplay.getHours() +
                ":" +
                dateToDisplay.getMinutes()
            );
        } else if (date == currentDate - 1) {
            return (
                "Yesterday at " +
                dateToDisplay.getHours() +
                ":" +
                dateToDisplay.getMinutes()
            );
        } else {
            return (
                dateToDisplay.toLocaleDateString() +
                " " +
                dateToDisplay.getHours() +
                ":" +
                dateToDisplay.getMinutes()
            );
        }
    }
}
