import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {DocumentEntity} from "../../database/documentEntity";
import {Chat, ChatMessage} from "../../interfaces";

@Schema({ collection: 'chat' })
export class ChatEntity extends DocumentEntity implements Chat {
  @Prop()
  messages: ChatMessage[];

  @Prop()
  sessionId: string;
}

export const ChatSchema = SchemaFactory.createForClass(ChatEntity);