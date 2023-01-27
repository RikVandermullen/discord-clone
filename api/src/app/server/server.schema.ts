import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, {
    Document,
    ObjectId,
    Schema as MongooseSchema
} from "mongoose";

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

    @Prop({ required: true, type: Date })
    date_created: Date;
}

export const ServerSchema = SchemaFactory.createForClass(Server);
