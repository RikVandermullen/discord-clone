/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
    UseGuards
} from "@nestjs/common";
import { MessageService } from "./message.service";
import { Message } from "../../../../src/app/models/Message";

@Controller("messages")
export class MessageController {
    constructor(private readonly messageService: MessageService) {}

    @Get(":serverId")
    async getMessagesByServerId(@Param("serverId") serverId: string) {
        return this.messageService.getMessagesByServerId(serverId);
    }

    @Post()
    async addMessage(@Body() message: Message) {
        return this.messageService.addMessage(
            message.author._id,
            message.date_created,
            message.content,
            message.server!
        );
    }

    @Delete(":messageId")
    async deleteMessage(@Param("messageId") messageId: string) {
        return this.messageService.deleteMessage(messageId);
    }
}
