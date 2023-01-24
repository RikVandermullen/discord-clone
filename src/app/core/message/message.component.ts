import { Component, Input } from '@angular/core';
import { Message } from '../../models/Message'

@Component({
  selector: 'discord-clone-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css'],
})

export class MessageComponent {
  @Input() message: Message;

}
