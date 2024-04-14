import {DocumentEntity} from "../../database/documentEntity";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Message} from "../../interfaces";
import {MessageType} from "../../enums";

@Schema({ collection: 'message' })
export class MessageEntity extends DocumentEntity implements Message{
  @Prop()
  public chatId: string;

  @Prop()
  public type: MessageType;

  @Prop()
  public content: string;
}

export const MessageSchema = SchemaFactory.createForClass(MessageEntity);