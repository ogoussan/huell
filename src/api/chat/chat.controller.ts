import {ApiOkResponse, ApiOperation, ApiTags} from "@nestjs/swagger";
import {Body, Controller, Get, Param, Post, Res} from "@nestjs/common";
import {ChatService} from "./chat.service";
import {Chat} from "../../interfaces";
import { Response } from 'express';
import {ObjectId} from "mongodb";
import {ChatDto, ChatMessageDto, UserChatMessageDto} from "./chat.dto";

@ApiTags('chat')
@Controller('chat')
export class ChatController {
  constructor(
    private chatService: ChatService,
  ) {}

  @Post('')
  @ApiOperation({
    summary: 'Prompt the chat AI'
  })
  public async prompt(@Body() data: UserChatMessageDto, @Res() res: Response): Promise<void> {
    try {
      const objectId = new ObjectId();
      const sessionId = objectId.toHexString();
      const readableStream = await this.chatService.prompt('hello there', sessionId);
      res.setHeader('Content-Type', 'text/plain');
      readableStream.pipe(res);
    } catch (error) {
      console.error('Error in controller:', error);
      res.status(500).send('Internal Server Error');
    }
  }

  @Post(':id')
  @ApiOperation({
    summary: 'Prompt the chat AI with session id'
  })
  public async promptBySessionId(@Param('sessionId') sessionId: string, @Body() data: UserChatMessageDto, @Res() res: Response): Promise<void> {
    try {
      const readableStream = await this.chatService.prompt('hello there', sessionId);
      res.setHeader('Content-Type', 'text/plain');
      readableStream.pipe(res);
    } catch (error) {
      console.error('Error in controller:', error);
      res.status(500).send('Internal Server Error');
    }
  }

  @Get()
  @ApiOperation({
    summary: 'Get all chats'
  })
  @ApiOkResponse({ type: ChatDto, isArray: true })
  public async getAll(): Promise<Chat[]> {
    return this.chatService.getChats();
  }
}