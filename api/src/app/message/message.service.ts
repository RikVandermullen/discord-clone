/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Injectable } from "@nestjs/common";

import mongoose, { Model, Mongoose, ObjectId } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

import { Message as MessageModel, MessageDocument } from "./message.schema";
import { User } from "../../../../src/app/models/User";

@Injectable()
export class MessageService {
    constructor(
        @InjectModel(MessageModel.name)
        private messageModel: Model<MessageDocument>
    ) {}

    async addMessage(
        author: string,
        date_created: Date,
        content: string,
        serverId: string
    ) {
        const message = new this.messageModel({
            author: new mongoose.Types.ObjectId(author),
            date_created: date_created,
            content: content,
            serverId: new mongoose.Types.ObjectId(serverId)
        });
        await message.save();
    }

    async getMessagesByServerId(serverId: string) {
        const messages = await this.messageModel.aggregate([
            { $match: { serverId: new mongoose.Types.ObjectId(serverId) } },
            {
                $lookup: {
                    from: "users",
                    localField: "author",
                    foreignField: "_id",
                    as: "author"
                }
            },
            { $unwind: { path: "$author", preserveNullAndEmptyArrays: true } }
        ]);
        return messages;
    }

    async deleteMessage(messageId: string) {
        await this.messageModel.deleteOne({
            _id: new mongoose.Types.ObjectId(messageId)
        });
    }
}
