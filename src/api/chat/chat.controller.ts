import {ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags} from "@nestjs/swagger";
import {Body, Controller, Delete, Get, HttpStatus, NotFoundException, Param, Post, Res} from "@nestjs/common";
import {ChatService} from "./chat.service";
import {Chat} from "../../interfaces";
import { Response } from 'express';
import {ChatDto, UserChatMessageDto} from "./chat.dto";
import {ErrorDto} from "../../app/error.dto";
import { DeleteResult } from 'typeorm';

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
      const readableStream = await this.chatService.prompt(data.content);
      res.setHeader('Content-Type', 'text/plain');
      readableStream.pipe(res);
    } catch (error) {
      console.error('Error in controller:', error);
      res.status(500).send('Internal Server Error');
    }
  }

  @Post(':sessionId')
  public async promptBySessionId(
    @Param('sessionId') sessionId: string,
    @Body() data: UserChatMessageDto,
    @Res() res: Response
  ): Promise<void> {
    try {
      const readableStream = await this.chatService.prompt(data.content, sessionId);
      res.setHeader('Content-Type', 'text/plain');
      readableStream.pipe(res);
    } catch (error) {
      console.error('Error in controller:', error);
      if (error instanceof NotFoundException) {
        res.status(HttpStatus.NOT_FOUND).send(error.message);
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Internal Server Error');
      }
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

  @Delete(':sessionId')
  @ApiOperation({ summary: 'Delete a chat by sessionId' })
  @ApiOkResponse({ type: DeleteResult })
  @ApiNotFoundResponse({ type: ErrorDto })
  public async deleteContxtById(@Param('sessionId') id: string): Promise<boolean> {
    return this.chatService.deleteChatBySessionId(id);
  }
}