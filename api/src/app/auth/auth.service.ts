/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Injectable } from "@nestjs/common";

import { JwtPayload, verify, sign } from "jsonwebtoken";
import { hash, compare } from "bcrypt";

import mongoose, { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

import { Identity, IdentityDocument } from "./identity.schema";
import { User, UserDocument } from "./user.schema";
import { Status } from "src/app/models/Status";

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(Identity.name)
        private identityModel: Model<IdentityDocument>,
        @InjectModel(User.name) private userModel: Model<UserDocument>
    ) {}

    async verifyToken(token: string): Promise<string | JwtPayload> {
        return new Promise((resolve, reject) => {
            verify(token, "Secret", (err: any, payload: any) => {
                if (err) reject(err);
                else resolve(payload);
            });
        });
    }

    async createUser(
        emailAddress: string,
        userName: string,
        password: string,
        dateOfBirth: Date,
        date_created: Date,
        status: Status
    ): Promise<string> {
        const user = new this.userModel({
            emailAddress: emailAddress,
            userName: userName,
            password: password,
            dateOfBirth: dateOfBirth,
            date_created: date_created,
            status: status,
            displayedStatus: status
        });
        console.log(user);

        await user.save();
        return user.id;
    }

    async getUserByEmailAddress(emailAddress: string): Promise<string | null> {
        return this.userModel.findOne({ emailAddress: emailAddress });
    }

    async registerUser(emailAddress: string, password: string) {
        const generatedHash = await hash(password, parseInt("5", 10));
        const identity = new this.identityModel({
            emailAddress: emailAddress,
            hash: generatedHash
        });
        console.log(identity);

        await identity.save();
    }

    async generateToken(
        emailAddress: string,
        password: string
    ): Promise<string> {
        const identity = await this.identityModel.findOne({
            emailAddress: emailAddress
        });

        if (!identity || !(await compare(password, identity.hash)))
            throw new Error("user not authorized");

        const user = await this.userModel.findOne({
            emailAddress: emailAddress
        });

        return new Promise((resolve, reject) => {
            sign({ user }, "Secret", (err: any, token: any) => {
                if (err) reject(err);
                else resolve(token);
            });
        });
    }
}
