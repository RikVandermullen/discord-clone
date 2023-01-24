import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { WebsocketService } from './context/WebsocketService';
import { Message } from './models/Message';

@Component({
  selector: 'discord-clone-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'Home';
  message: Message = new Message(1, "", new Date(), "Chihi");
  messages: Message[] = [];
  subscription: Subscription;
  
  constructor(private WebsocketService: WebsocketService) {  
    
  }

  ngOnInit() {
    this.subscription = this.WebsocketService.onNewMessage().subscribe((data:any) => {
      const message: Message = new Message(data._id, data.content, data.date, data.author)
      this.messages.push(message);      
    });
  }

  sendMessage() {
    if (this.message.content == "") return;    
    this.WebsocketService.sendMessage(this.message);
    this.message.content = "";
  }

  onDestroy() {
    this.subscription.unsubscribe();
  }
}
