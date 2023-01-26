import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type IdentityDocument = Identity & Document;

@Schema()
export class Identity {
    @Prop({ required: true, unique: true, type: String })
    emailAddress: string;

    @Prop({ required: true, type: String })
    hash: string;
}

export const IdentitySchema = SchemaFactory.createForClass(Identity);
