import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {MongooseConfigService} from "../database/mongoose.service";
import {ChatModule} from "../api/chat/chat.module";
import {MessageModule} from "../api/message/message.module";

@Module({
  imports: [
    MongooseModule.forRootAsync({imports: undefined, useClass: MongooseConfigService }),
    ChatModule,
    MessageModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
