import {DocumentDto} from "../../database/document.dto";
import {Message} from "../../interfaces";
import {MessageType} from "../../enums";
import {IsEnum, IsOptional, IsString} from "class-validator";
import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";

export class MessageDto extends DocumentDto implements Message{
  @IsEnum(MessageType)
  @ApiProperty({example: 'user'})
  public type!: MessageType

  @IsString()
  @ApiProperty({example: 'Hello :)'})
  public content!: string

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({example: 'd9255488-a7fb-4702-8d3a-40d9bcc6c9cf'})
  public chatId?: string
}