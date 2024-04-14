import {ApiBadRequestResponse, ApiCreatedResponse, ApiOperation, ApiTags} from "@nestjs/swagger";
import {Body, Controller, Post} from "@nestjs/common";
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
  public async createUser(@Body() body: MessageDto): Promise<Message> {
    return this.messageService.createMessage(body);
  }
}