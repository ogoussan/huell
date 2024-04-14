import {ApiBadRequestResponse, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags} from "@nestjs/swagger";
import {Body, Controller, Get, Param, Post} from "@nestjs/common";
import {ErrorDto} from "../../app/error.dto";
import {MessageDto} from "./message.dto";
import {Message} from "../../interfaces";
import {MessageService} from "./message.service";

@ApiTags('message')
@Controller('message')
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
  ) {

  }
  @Post()
  @ApiOperation({
    summary: 'Create message',
  })
  @ApiCreatedResponse({ type: MessageDto })
  @ApiBadRequestResponse({ type: ErrorDto })
  public async createMessage(@Body() body: MessageDto): Promise<Message> {
    return this.messageService.createMessage(body);
  }

  @Get('chat/:chatId')
  @ApiOperation({
    summary: 'Get messages by chatId'
  })
  @ApiOkResponse({ type: MessageDto, isArray: true })
  public async getMessagesByChatId( @Param('chatId') chatId: string,): Promise<Message[]> {
    console.log(chatId);
    return this.messageService.getMessagesByChatId(chatId);
  }
}