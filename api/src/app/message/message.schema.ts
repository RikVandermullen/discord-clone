import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, {
    Document,
    ObjectId,
    Schema as MongooseSchema
} from "mongoose";

export type MessageDocument = Message & Document;

@Schema()
export class Message {
    _id?: string;

    @Prop({ required: true, type: mongoose.Types.ObjectId })
    author: ObjectId;

    @Prop({ required: true, type: Date })
    date_created?: Date;

    @Prop({ required: true, type: String })
    content?: number;

    @Prop({ required: true, type: mongoose.Types.ObjectId })
    server?: ObjectId;

    @Prop({ required: true, type: Boolean })
    isEdited?: boolean;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
