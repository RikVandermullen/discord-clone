/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Injectable } from "@nestjs/common";

import mongoose, { Model, Mongoose, ObjectId } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

import { Server as ServerModel, ServerDocument } from "./server.schema";
import { Status } from "../../../../src/app/models/Status";
import { User } from "../../../../src/app/models/User";
import { ServerType } from "../../../../src/app/models/ServerType";
import { User as UserModel, UserDocument } from "../auth/user.schema";
import {
    UserMessage,
    UserMessage as UserMessageModel,
    UserMessageDocument
} from "./UserMessage.schema";

@Injectable()
export class ServerService {
    constructor(
        @InjectModel(ServerModel.name)
        private serverModel: Model<ServerDocument>
    ) {}

    async createServer(
        name: string,
        owner: string,
        date_created: Date,
        users: User[],
        type: ServerType
    ) {
        const ownerId = new mongoose.Types.ObjectId(owner);
        const usersIds: any = [];
        users.forEach((user) => {
            user.displayedStatus = Status.Online;
            usersIds.push(new mongoose.Types.ObjectId(user._id));
        });
        const server = new this.serverModel({
            name: name,
            owner: ownerId,
            users: [ownerId],
            messages: [usersIds],
            lastMessageRead: [new UserMessage(owner, "")],
            date_created: date_created,
            type: type
        });
        console.log("SERVER:", server);

        await server.save();
        return server;
    }

    async getServersByUserId(userId: string) {
        return await this.serverModel.aggregate([
            { $match: { users: new mongoose.Types.ObjectId(userId) } },
            {
                $lookup: {
                    from: "users",
                    localField: "users",
                    foreignField: "_id",
                    as: "users"
                }
            }
        ]);
    }

    async removeUserFromServer(serverId: string, userId: string) {
        return await this.serverModel.updateOne(
            { _id: new mongoose.Types.ObjectId(serverId) },
            { $pull: { users: new mongoose.Types.ObjectId(userId) } }
        );
    }

    async addUserToServer(serverId: string, userId: string) {
        const userMessage = new UserMessage(userId, "");
        const result = await this.serverModel.updateOne(
            { _id: new mongoose.Types.ObjectId(serverId) },
            {
                $push: {
                    users: new mongoose.Types.ObjectId(userId),
                    lastMessageRead: userMessage
                }
            }
        );
    }

    async getServerById(serverId: string) {
        return await this.serverModel.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(serverId) } },
            {
                $lookup: {
                    from: "users",
                    localField: "users",
                    foreignField: "_id",
                    as: "users"
                }
            }
        ]);
    }

    async clearLastMessageRead(serverId: string, userId: string) {
        return this.serverModel.updateOne(
            { _id: new mongoose.Types.ObjectId(serverId) },
            { $set: { "lastMessageRead.$[elem].message": "" } },
            { arrayFilters: [{ "elem.user": userId }] }
        );
    }

    async setLastMessageReadIfEmpty(
        serverId: string,
        user: string,
        message: string
    ) {
        console.log("setLastMessageReadIfEmpty: ", serverId, user, message);

        return this.serverModel.updateOne(
            { _id: new mongoose.Types.ObjectId(serverId) },
            {
                $set: {
                    "lastMessageRead.$[user].message": message
                }
            },
            {
                arrayFilters: [
                    {
                        "user.user": user,
                        "user.message": ""
                    }
                ]
            }
        );
    }
}
