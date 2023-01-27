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
}
