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
import { UserService } from "./user.service";
import { Server } from "../../../../src/app/models/Server";

@Controller("users")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Put(":userId")
    async updateStatus(@Body() body: string) {
        const response = JSON.parse(JSON.stringify(body));

        return this.userService.setUserStatus(response.userId, response.status);
    }

    @Get(":userId")
    async getUserById(@Param("userId") userId: string) {
        return this.userService.getUserById(userId);
    }
}
