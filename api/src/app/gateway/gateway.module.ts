import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "../auth/user.schema";
import { Message, MessageSchema } from "../message/message.schema";
import { MessageService } from "../message/message.service";
import { Server, ServerSchema } from "../server/server.schema";
import { ServerService } from "../server/server.service";
import { UserService } from "../user/user.service";
import { Gateway } from "./gateway";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Message.name, schema: MessageSchema },
            { name: User.name, schema: UserSchema },
            { name: Server.name, schema: ServerSchema }
        ])
    ],
    providers: [Gateway, MessageService, UserService, ServerService]
})
export class GatewayModule {}
