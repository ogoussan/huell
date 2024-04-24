import {IsArray, IsEnum, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";
import {DocumentDto} from "../../database/document.dto";
import {Chat, ChatMessage, UserChatMessage} from "../../interfaces";
import {ChatMessageType} from "../../enums";


export class ChatDto extends DocumentDto implements Chat {
  @IsString()
  @ApiProperty()
  sessionId: string;

  @IsArray()
  @ApiProperty()
  messages: ChatMessage[];
}

export class UserChatMessageDto extends DocumentDto implements UserChatMessage{
  @IsString()
  @ApiProperty()
  content: string;
}


export class ChatMessageDto extends DocumentDto implements ChatMessage{
  @IsEnum(ChatMessageType)
  @ApiProperty()
  type: ChatMessageType;

  @ApiProperty()
  data: {
    content: string;
  }
}