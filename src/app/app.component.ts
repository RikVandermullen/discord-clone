import {
    AfterViewChecked,
    Component,
    ElementRef,
    OnInit,
    ViewChild
} from "@angular/core";
import { Subscription } from "rxjs";
import { WebsocketService } from "./context/WebsocketService";
import { Message } from "./models/Message";

@Component({
    selector: "discord-clone-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit, AfterViewChecked {
    @ViewChild("messageContainer") private messageContainer: ElementRef;

    title = "Home";
    message: Message = new Message(1, "", new Date(), "Chihi");
    messages: Message[] = [];
    subscription: Subscription;

    constructor(private WebsocketService: WebsocketService) {}

    ngOnInit() {
        this.subscription = this.WebsocketService.onNewMessage().subscribe(
            (data) => {
                this.messages.push(data);
            }
        );
    }

    ngAfterViewChecked() {
        this.scrollToBottom();
    }

    onDestroy() {
        this.subscription.unsubscribe();
    }

    scrollToBottom(): void {
        try {
            this.messageContainer.nativeElement.scrollTop =
                this.messageContainer.nativeElement.scrollHeight;
        } catch (err) {
            console.log(err);
        }
    }
}
