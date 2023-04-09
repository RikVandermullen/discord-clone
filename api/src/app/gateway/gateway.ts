/* eslint-disable @nrwl/nx/enforce-module-boundaries */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { OnModuleInit } from "@nestjs/common";
import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { User } from "../../../../src/app/models/User";
import { Status } from "../../../../src/app/models/Status";
import { MessageService } from "../message/message.service";
import { ServerService } from "../server/server.service";
import { UserService } from "../user/user.service";

@WebSocketGateway({
    cors: {
        origin: "http://localhost:4200"
    }
})
export class Gateway implements OnModuleInit {
    @WebSocketServer()
    server: Server | undefined;

    constructor(
        private messageService: MessageService,
        private userService: UserService,
        private serverService: ServerService
    ) {}

    onModuleInit() {
        this.server?.on("connection", (socket) => {
            console.log("Connected: " + socket.id);
            const userId = socket.handshake.query["userId"]!.toString();
            console.log("User ID: " + userId);
            const body = { userId: userId, status: Status.Online };
            this.server?.emit("onStatusChange", body);

            socket.on("disconnect", () => {
                console.log("Disconnected: " + socket.id);
                const data = this.userService.setUserStatus(
                    userId,
                    Status.Offline
                );
                const body = { userId: userId, status: Status.Offline };
                this.server?.emit("onStatusChange", body);
            });
        });
    }

    @SubscribeMessage("newMessage")
    async onNewMessage(@MessageBody() body: any) {
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

            const server = await this.serverService
                .getServerById(body.server)
                .then((server) => {
                    return server;
                });
            server[0].users.forEach((user: User) => {
                if (user.status === Status.Offline) {
                    this.serverService.setLastMessageReadIfEmpty(
                        server[0]._id,
                        user._id.toString(),
                        message._id.toString()
                    );
                }
            });
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

    @SubscribeMessage("setDisplayStatus")
    async setDisplayStatus(@MessageBody() data: any) {
        console.log(
            "DisplayStatus set: ",
            data._id,
            " Status: ",
            data.displayedStatus
        );
        this.server?.emit("onDisplayStatusChange", data);
    }
}
