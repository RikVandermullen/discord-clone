/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";
import { Status } from "../../../../src/app/models/Status";
import { UserFriendStatus } from "../user/FriendStatus.schema";

export type UserDocument = User & Document;

@Schema()
export class User {
    _id: string;

    @Prop({ required: true, unique: true, type: String })
    emailAddress?: string;

    @Prop({ required: true, type: String })
    userName?: string;

    @Prop({ required: true, type: String })
    password?: string;

    @Prop({ required: true, type: Date })
    dateOfBirth?: Date;

    @Prop({ required: true, type: Date })
    date_created?: Date;

    @Prop({ required: true, type: String, enum: Status })
    status?: Status;

    @Prop({ required: true, type: String, enum: Status })
    displayedStatus?: Status;

    @Prop({
        required: false,
        type: []
    })
    friends: UserFriendStatus[];
}

export const UserSchema = SchemaFactory.createForClass(User);
