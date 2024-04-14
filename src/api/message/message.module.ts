import { Module } from '@nestjs/common';
import {MessageService} from "./message.service";
import {MongooseModule} from "@nestjs/mongoose";
import {MessageEntity, MessageSchema} from "./message.entity";
import {MessageController} from "./message.controller";
import {ChatModule} from "../chat/chat.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: MessageEntity.name, schema: MessageSchema }]),
    ChatModule,
  ],
  controllers: [MessageController],
  providers: [MessageService],
  exports: [],
})
export class MessageModule {}