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
import { ServerService } from "./server.service";
import { Server } from "../../../../src/app/models/Server";

@Controller("servers")
export class ServerController {
    constructor(private readonly serverService: ServerService) {}

    @Post()
    async createServer(@Body() server: Server) {
        return this.serverService.createServer(
            server.name,
            server.owner._id,
            server.date_created
        );
    }

    @Post("/join")
    async joinServer(@Body() body: string) {
        const response = JSON.parse(JSON.stringify(body));

        return this.serverService.addUserToServer(
            response.serverId,
            response.userId
        );
    }

    @Get("users/:userId")
    async getServersByUserId(@Param("userId") userId: string) {
        return this.serverService.getServersByUserId(userId);
    }

    @Get(":serverId")
    async getServerById(@Param("serverId") serverId: string) {
        return this.serverService.getServerById(serverId);
    }

    @Put(":serverId")
    async setLastMessageRead(
        @Param("serverId") serverId: string,
        @Body() body: string
    ) {
        const response = JSON.parse(JSON.stringify(body));

        return this.serverService.setLastMessageRead(
            serverId,
            response.userId,
            response.messageId
        );
    }
}
