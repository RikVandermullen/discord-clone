import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { AuthService } from "./auth/auth.service";
import { AuthController } from "./auth/auth.controller";
import { Identity, IdentitySchema } from "./auth/identity.schema";
import { Message, MessageSchema } from "./message/message.schema";
import { MessageController } from "./message/message.controller";
import { MessageService } from "./message/message.service";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Identity.name, schema: IdentitySchema },
            { name: Message.name, schema: MessageSchema }
        ])
    ],
    controllers: [MessageController],
    providers: [MessageService]
})
export class DataModule {}
