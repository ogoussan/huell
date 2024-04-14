import {ApiOkResponse, ApiOperation, ApiTags} from "@nestjs/swagger";
import {Controller, Get} from "@nestjs/common";
import {ChatDto} from "./chat.dto";
import {ChatService} from "./chat.service";
import {Chat} from "../../interfaces";

@ApiTags('chat')
@Controller('chat')
export class ChatController {
  constructor(
    private chatService: ChatService,
  ) {
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