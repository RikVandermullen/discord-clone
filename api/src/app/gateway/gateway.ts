import { OnModuleInit } from '@nestjs/common';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ 
    cors: {
        origin: 'http://localhost:4200',
    } 
})
export class Gateway implements OnModuleInit {
    @WebSocketServer()
    server: Server | undefined;

    onModuleInit() {
        this.server?.on('connection', (socket) => {
            console.log(socket.id);
        });
    }

    @SubscribeMessage('newMessage')
    onNewMessage(@MessageBody() body: string) {
        console.log(body);
        this.server?.emit('onMessage', body);
    }

}