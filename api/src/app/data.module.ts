import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { AuthService } from "./auth/auth.service";
import { AuthController } from "./auth/auth.controller";
import { Identity, IdentitySchema } from "./auth/identity.schema";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Identity.name, schema: IdentitySchema }
        ])
    ],
    controllers: [],
    providers: []
})
export class DataModule {}
