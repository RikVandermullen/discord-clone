import { Injectable } from "@nestjs/common";

import mongoose, { Model, Mongoose, ObjectId } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

import { Server as ServerModel, ServerDocument } from "./server.schema";

@Injectable()
export class ServerService {
    constructor(
        @InjectModel(ServerModel.name)
        private serverModel: Model<ServerDocument>
    ) {}

    async createServer(name: string, owner: string, date_created: Date) {
        const ownerId = new mongoose.Types.ObjectId(owner);
        const server = new this.serverModel({
            name: name,
            owner: ownerId,
            users: [ownerId],
            date_created: date_created
        });
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
        const result = await this.serverModel.updateOne(
            { _id: new mongoose.Types.ObjectId(serverId) },
            { $push: { users: new mongoose.Types.ObjectId(userId) } }
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
}
