import { Module } from '@nestjs/common';
import {ChatController} from "./chat.controller";
import {ChatService} from "./chat.service";
import {MongooseModule} from "@nestjs/mongoose";
import {ChatEntity, ChatSchema} from "./chat.entity";
import {SseService} from "./server-sent-event.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ChatEntity.name, schema: ChatSchema }]),
  ],
  controllers: [ChatController],
  providers: [ChatService, SseService],
  exports: [ChatService, SseService],
})
export class ChatModule {}