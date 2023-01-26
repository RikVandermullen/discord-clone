import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./user.schema";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { Identity, IdentitySchema } from "./identity.schema";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Identity.name, schema: IdentitySchema },
            { name: User.name, schema: UserSchema }
        ])
    ],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService]
})
export class AuthModule {}
