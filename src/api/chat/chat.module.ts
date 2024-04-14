import { Module } from '@nestjs/common';
import {ChatController} from "./chat.controller";
import {ChatService} from "./chat.service";
import {MongooseModule} from "@nestjs/mongoose";
import {ChatEntity, ChatSchema} from "./chat.entity";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ChatEntity.name, schema: ChatSchema }]),
  ],
  controllers: [ChatController],
  providers: [ChatService],
  exports: [ChatService],
})
export class ChatModule {}