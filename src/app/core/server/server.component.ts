import { Component } from '@angular/core';

@Component({
  selector: 'discord-clone-server',
  templateUrl: './server.component.html',
  styleUrls: ['./server.component.css'],
})
export class ServerComponent {
  servers: string[] = [
    "server1",
    "server2",
    "server3"
  ]
}
