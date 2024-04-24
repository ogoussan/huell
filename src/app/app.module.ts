import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {MongooseConfigService} from "../database/mongoose.service";
import {ChatModule} from "../api/chat/chat.module";

@Module({
  imports: [
    MongooseModule.forRootAsync({imports: undefined, useClass: MongooseConfigService }),
    ChatModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
