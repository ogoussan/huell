import {IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";
import {DocumentDto} from "../../database/document.dto";
import {Chat} from "../../interfaces";

export class ChatDto extends DocumentDto implements Chat{
  @IsString()
  @ApiProperty()
  name: string;
}