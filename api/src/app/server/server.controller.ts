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

    @Get(":userId")
    async getServersByUserId(@Param("userId") userId: string) {
        return this.serverService.getServersByUserId(userId);
    }
}
