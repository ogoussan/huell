import {Controller, Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {MessageEntity} from "./message.entity";
import {Message} from "../../interfaces";
import {ChatService} from "../chat/chat.service";
import {ApiTags} from "@nestjs/swagger";

@ApiTags('message')
@Controller('message')
@Injectable()
export class MessageService {
  constructor(
    @InjectModel(MessageEntity.name)
    private readonly messageModel: Model<MessageEntity>,
    private readonly chatService: ChatService,
  ) {
  }
  public async getMessagesByChatId(chatId: string): Promise<Message[]> {
    return this.messageModel.find({chatId}).exec();
  }

  public async createMessage(message: Message): Promise<Message> {
    let chat;

    if (message.chatId) {
      chat = await this.chatService.getChatById(message.chatId);
    } else {
      // TODO: pass message content to llm to get name
      const name = 'MyChat';
      chat = await this.chatService.createChat(name);
    }

    const newMessage =
      new this.messageModel({chatId: chat.id, ...message});

    return newMessage.save();
  }
}