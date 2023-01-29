import { Injectable } from "@nestjs/common";

import mongoose, { Model, Mongoose, ObjectId } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

import { Status } from "../../../../src/app/models/Status";
import { User as UserModel, UserDocument } from "../auth/user.schema";

@Injectable()
export class UserService {
    constructor(
        @InjectModel(UserModel.name)
        private userModel: Model<UserDocument>
    ) {}

    async setUserStatus(userId: string, status: Status) {
        await this.userModel.updateOne(
            { _id: new mongoose.Types.ObjectId(userId) },
            { $set: { status: status } }
        );

        return this.getUserById(userId);
    }

    async setUserDisplayedStatus(userId: string, status: Status) {
        await this.userModel.updateOne(
            { _id: new mongoose.Types.ObjectId(userId) },
            { $set: { displayedStatus: status } }
        );

        return this.getUserById(userId);
    }

    async getUserById(userId: string) {
        return await this.userModel.findById(
            new mongoose.Types.ObjectId(userId)
        );
    }
}
