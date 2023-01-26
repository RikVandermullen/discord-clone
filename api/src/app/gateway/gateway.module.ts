import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Message, MessageSchema } from "../message/message.schema";
import { MessageService } from "../message/message.service";
import { Gateway } from "./gateway";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Message.name, schema: MessageSchema }
        ])
    ],
    providers: [Gateway, MessageService]
})
export class GatewayModule {}
