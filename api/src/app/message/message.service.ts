/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Injectable } from "@nestjs/common";

import mongoose, { Model, Mongoose, ObjectId } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

import { Message as MessageModel, MessageDocument } from "./message.schema";

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
        server: string,
        isEdited: boolean
    ) {
        const message = new this.messageModel({
            author: new mongoose.Types.ObjectId(author),
            date_created: date_created,
            content: content,
            server: new mongoose.Types.ObjectId(server),
            isEdited: isEdited
        });
        await message.save();
        return message;
    }

    async getMessagesByServerId(server: string) {
        const messages = await this.messageModel.aggregate([
            { $match: { server: new mongoose.Types.ObjectId(server) } },
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

    async editMessage(messageId: string, content: string) {
        await this.messageModel.updateOne(
            { _id: new mongoose.Types.ObjectId(messageId) },
            { $set: { content: content, isEdited: true } }
        );
    }
}
