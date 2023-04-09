import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, {
    Document,
    ObjectId,
    Schema as MongooseSchema
} from "mongoose";
import { UserMessage } from "./UserMessage.schema";
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { ServerType } from "../../../../src/app/models/ServerType";

export type ServerDocument = Server & Document;

@Schema()
export class Server {
    _id?: string;

    @Prop({ required: true, type: String })
    name: string;

    @Prop({ required: true, type: mongoose.Types.ObjectId })
    owner: ObjectId;

    @Prop({ required: false, type: [mongoose.Types.ObjectId] })
    users: ObjectId[];

    @Prop({
        required: false,
        type: []
    })
    lastMessageRead: UserMessage[];

    @Prop({ required: true, type: Date })
    date_created: Date;

    @Prop({ required: true, type: String, enum: ServerType })
    type?: ServerType;
}

export const ServerSchema = SchemaFactory.createForClass(Server);
