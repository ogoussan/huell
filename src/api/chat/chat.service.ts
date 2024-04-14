import {Injectable, NotFoundException} from "@nestjs/common";
import {Model} from "mongoose";
import {ChatEntity} from "./chat.entity";
import {Chat} from "../../interfaces";
import {InjectModel} from "@nestjs/mongoose";

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(ChatEntity.name)
    private readonly chatModel: Model<ChatEntity>,
  ) {}

  public async getChatById(id: string): Promise<Chat> {
    const result = await this.chatModel.findById(id).exec();

    if (!result) {
      throw new NotFoundException([`Chat with id ${id} not found`]);
    }

    return result;
  }

  public async getChats(): Promise<Chat[]> {
    return await this.chatModel.find().exec();
  }

  public async createChat(name: string):Promise<Chat> {
    const chat = new this.chatModel({name});
    return chat.save();
  }
}