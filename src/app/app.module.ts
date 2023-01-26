import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "./app-routing.module";

import { AppComponent } from "./app.component";
import { WebsocketService } from "./context/WebsocketService";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ServerComponent } from "./core/server/server.component";
import { FormsModule } from "@angular/forms";
import { MessageComponent } from "./core/message/message.component";
import { InputComponent } from "./core/input/input.component";
import { MembersComponent } from "./core/members/members.component";
import { DatePipe } from "@angular/common";

@NgModule({
    declarations: [
        AppComponent,
        ServerComponent,
        MessageComponent,
        InputComponent,
        MembersComponent
    ],
    imports: [BrowserModule, NgbModule, AppRoutingModule, FormsModule],
    providers: [WebsocketService, DatePipe],
    bootstrap: [AppComponent]
})
export class AppModule {}
