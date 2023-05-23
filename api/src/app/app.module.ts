import { Module } from "@nestjs/common";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { GatewayModule } from "./gateway/gateway.module";
import { MongooseModule } from "@nestjs/mongoose";
import { DataModule } from "./data.module";
import { AuthModule } from "./auth/auth.module";

// test MongoDB connection, will be changed
@Module({
    imports: [
        GatewayModule,
        DataModule,
        AuthModule,
        MongooseModule.forRoot(
            "mongodb+srv://Admin:Secret123@cluster0.asqllev.mongodb.net/discord?retryWrites=true&w=majority"
        )
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}
