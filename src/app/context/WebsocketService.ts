import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { Message } from '../models/Message';

@Injectable()
export class WebsocketService {
    private socket: Socket;

    constructor() {
        this.socket = io('http://localhost:3333');
    }

    onNewMessage() {
        return new Observable((observer) => {
            this.socket.on('onMessage', (data: Message) => {                               
                observer.next(data);
            });
        });
    }

    sendMessage(message: Message) {        
        this.socket.emit('newMessage', message);
    }
}