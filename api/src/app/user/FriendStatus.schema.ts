/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, {
    Document,
    ObjectId,
    Schema as MongooseSchema
} from "mongoose";
import { FriendStatus } from "../../../../src/app/models/FriendStatus";

export type UserFriendStatusDocument = UserFriendStatus & Document;

@Schema()
export class UserFriendStatus {
    _id?: string;

    @Prop({ required: false, type: String })
    user: string;

    @Prop({ required: true, type: String, enum: FriendStatus })
    status: FriendStatus;

    constructor(user: string, status: FriendStatus) {
        this.user = user;
        this.status = status;
    }
}

export const FriendStatusSchema =
    SchemaFactory.createForClass(UserFriendStatus);
