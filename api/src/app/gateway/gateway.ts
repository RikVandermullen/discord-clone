import { OnModuleInit } from "@nestjs/common";
import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway({
    cors: {
        origin: "http://localhost:4200"
    }
})
export class Gateway implements OnModuleInit {
    @WebSocketServer()
    server: Server | undefined;

    onModuleInit() {
        this.server?.on("connection", (socket) => {
            console.log(socket.id);
        });
    }

    @SubscribeMessage("newMessage")
    onNewMessage(@MessageBody() body: any) {
        console.log(body);
        if (body.room) {
            this.server?.to(body.room).emit("onMessage", body);
        } else {
            this.server?.emit("onMessage", body);
        }
    }

    @SubscribeMessage("createRoom")
    createRoom(socket: Socket, data: any): WsResponse<unknown> {
        console.log("room created: ", data.room);

        socket.join(data.room);
        socket.to(data.room).emit("roomCreated", { room: data.room });
        return { event: "roomCreated", data: { room: data.room } };
    }

    @SubscribeMessage("joinRoom")
    joinRoom(socket: Socket, data: any): WsResponse<unknown> {
        console.log("room joined: ", data.room, data.user);

        socket.join(data.room);
        socket
            .to(data.room)
            .emit("roomJoined", { room: data.room, user: data.user });
        return { event: "roomJoined", data: { room: data.room } };
    }

    @SubscribeMessage("leaveRoom")
    leaveRoom(socket: Socket, data: any): WsResponse<unknown> {
        console.log("room left: ", data.room, data.user);
        socket.leave(data.room);
        socket
            .to(data.room)
            .emit("roomLeft", { room: data.room, user: data.user });
        return { event: "roomLeft", data: { room: data.room } };
    }
}
