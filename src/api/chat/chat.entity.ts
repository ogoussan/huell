import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {DocumentEntity} from "../../database/documentEntity";
import {Chat} from "../../interfaces";

@Schema({ collection: 'chat' })
export class ChatEntity extends DocumentEntity implements Chat {
  @Prop()
  public name: string;
}

export const ChatSchema = SchemaFactory.createForClass(ChatEntity);