/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Injectable } from "@nestjs/common";

import mongoose, { Model, Mongoose, ObjectId } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

import { Status } from "../../../../src/app/models/Status";
import { User as UserModel, UserDocument } from "../auth/user.schema";
import { FriendStatus } from "src/app/models/FriendStatus";
import { UserFriendStatus } from "./FriendStatus.schema";

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

    async addUserFriend(
        userId: string,
        friendId: string,
        friendStatus: FriendStatus
    ) {
        const userFriendStatus = new UserFriendStatus(friendId, friendStatus);
        console.log(userFriendStatus);

        await this.userModel.updateOne(
            { _id: new mongoose.Types.ObjectId(userId) },
            { $push: { friends: userFriendStatus } }
        );

        return this.getUserById(userId);
    }
}
