import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { AuthService } from "./auth/auth.service";
import { AuthController } from "./auth/auth.controller";
import { Identity, IdentitySchema } from "./auth/identity.schema";
import { Message, MessageSchema } from "./message/message.schema";
import { MessageController } from "./message/message.controller";
import { MessageService } from "./message/message.service";
import { Server, ServerSchema } from "./server/server.schema";
import { ServerController } from "./server/server.controller";
import { ServerService } from "./server/server.service";
import { User, UserSchema } from "./auth/user.schema";
import { UserController } from "./user/user.controller";
import { UserService } from "./user/user.service";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Identity.name, schema: IdentitySchema },
            { name: Message.name, schema: MessageSchema },
            { name: Server.name, schema: ServerSchema },
            { name: User.name, schema: UserSchema }
        ])
    ],
    controllers: [MessageController, ServerController, UserController],
    providers: [MessageService, ServerService, UserService]
})
export class DataModule {}
