import { OnModuleInit } from "@nestjs/common";
import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { MessageService } from "../message/message.service";

@WebSocketGateway({
    cors: {
        origin: "http://localhost:4200"
    }
})
export class Gateway implements OnModuleInit {
    @WebSocketServer()
    server: Server | undefined;

    constructor(private messageService: MessageService) {}

    onModuleInit() {
        this.server?.on("connection", (socket) => {
            console.log(socket.id);
        });
    }

    @SubscribeMessage("newMessage")
    async onNewMessage(@MessageBody() body: any) {
        console.log(body);
        if (body.server) {
            const message = await this.messageService.addMessage(
                body.author._id,
                body.date_created,
                body.content,
                body.server,
                body.isEdited
            );
            body._id = message._id;
            this.server?.to(body.server).emit("onMessage", body);
        } else {
            this.server?.emit("onMessage", body);
        }
    }

    @SubscribeMessage("deleteMessage")
    onDeleteMessage(socket: Socket, body: any): WsResponse<unknown> {
        console.log("Deleting message: ", body._id);

        this.messageService.deleteMessage(body._id);

        socket.join(body.server);
        socket.to(body.server).emit("onDeletedMessage", body);
        return { event: "onDeletedMessage", data: body };
    }

    @SubscribeMessage("editMessage")
    onEditMessage(socket: Socket, body: any): WsResponse<unknown> {
        console.log("Editing message: ", body._id);

        this.messageService.editMessage(body._id, body.content);
        body.isEdited = true;
        socket.join(body.server);
        socket.to(body.server).emit("onEditedMessage", body);
        return { event: "onEditedMessage", data: body };
    }

    @SubscribeMessage("createServer")
    createServer(socket: Socket, data: any): WsResponse<unknown> {
        console.log("Server created: ", data.server);

        socket.join(data.server);
        socket.to(data.server).emit("serverCreated", { server: data.server });
        return { event: "serverCreated", data: { server: data.server } };
    }

    @SubscribeMessage("joinServer")
    joinServer(socket: Socket, data: any): WsResponse<unknown> {
        console.log(
            "Server joined: ",
            "serverId: " + data.server,
            "userId: " + data.user
        );

        socket.join(data.server);
        socket
            .to(data.server)
            .emit("serverJoined", { server: data.server, user: data.user });
        return { event: "serverJoined", data: { server: data.server } };
    }

    @SubscribeMessage("leaveServer")
    leaveServer(socket: Socket, data: any): WsResponse<unknown> {
        console.log("Server left: ", data.server, data.user);
        socket.leave(data.server);
        socket
            .to(data.server)
            .emit("serverLeft", { server: data.server, user: data.user });
        return { event: "serverLeft", data: { server: data.server } };
    }
}
