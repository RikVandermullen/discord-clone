import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, {
    Document,
    ObjectId,
    Schema as MongooseSchema
} from "mongoose";

export type UserMessageDocument = UserMessage & Document;

@Schema()
export class UserMessage {
    _id?: string;

    @Prop({ required: false, type: String })
    user: string;

    @Prop({ required: true, type: String })
    message: string;

    constructor(user: string, message: string) {
        this.user = user;
        this.message = message;
    }
}

export const UserMessageSchema = SchemaFactory.createForClass(UserMessage);
