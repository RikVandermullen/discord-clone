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
import { LoginComponent } from "./core/auth/login/login.component";
import { RegisterComponent } from "./core/auth/register/register.component";
import { HttpClientModule } from "@angular/common/http";
import { httpInterceptorProviders } from "./core/auth/auth.interceptor";
import { DirectMessagesComponent } from "./core/direct-messages/direct-messages.component";
import { ProfileComponent } from "./core/profile/profile.component";

@NgModule({
    declarations: [
        AppComponent,
        ServerComponent,
        MessageComponent,
        InputComponent,
        MembersComponent,
        LoginComponent,
        RegisterComponent,
        DirectMessagesComponent,
        ProfileComponent
    ],
    imports: [
        BrowserModule,
        NgbModule,
        AppRoutingModule,
        FormsModule,
        HttpClientModule
    ],
    providers: [WebsocketService, DatePipe, httpInterceptorProviders],
    bootstrap: [AppComponent]
})
export class AppModule {}
