/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import {
    Body,
    Controller,
    HttpException,
    HttpStatus,
    Post,
    UseGuards
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserCredentials, User } from "../../../../src/app/models/User";

export type Id = string;
export type ResourceId = { id: Id };

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("register")
    async register(@Body() credentials: User): Promise<ResourceId> {
        try {
            await this.authService.registerUser(
                credentials.emailAddress,
                credentials.password
            );

            return {
                id: await this.authService.createUser(
                    credentials.emailAddress,
                    credentials.userName,
                    credentials.password,
                    credentials.dateOfBirth,
                    credentials.status
                )
            };
        } catch (e) {
            console.log(e);
            throw new HttpException("Username invalid", HttpStatus.BAD_REQUEST);
        }
    }

    @Post("login")
    async login(@Body() credentials: User) {
        try {
            return {
                token: await this.authService.generateToken(
                    credentials.emailAddress,
                    credentials.password
                ),
                user: await this.authService.getUserByEmailAddress(
                    credentials.emailAddress
                )
            };
        } catch (e) {
            throw new HttpException(
                "Invalid credentials",
                HttpStatus.UNAUTHORIZED
            );
        }
    }
}
