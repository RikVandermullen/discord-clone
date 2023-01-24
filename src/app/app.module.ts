import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { WebsocketService } from './context/WebsocketService';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ServerComponent } from './core/server/server.component';
import { FormsModule } from '@angular/forms';
import { MessageComponent } from './core/message/message.component';

@NgModule({
  declarations: [AppComponent, ServerComponent, MessageComponent],
  imports: [BrowserModule, NgbModule, FormsModule],
  providers: [WebsocketService],
  bootstrap: [AppComponent],
})
export class AppModule {}
