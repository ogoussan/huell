import {Injectable, NotFoundException} from "@nestjs/common";
import mongoose, {Model} from "mongoose";
import {ChatEntity} from "./chat.entity";
import {Chat, Message} from "../../interfaces";
import {InjectModel} from "@nestjs/mongoose";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatMessageHistory } from "langchain/stores/message/in_memory";
import { Ollama } from "@langchain/community/llms/ollama";
import {ChatNamePrompt} from "./chat.prompt";
import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";
import {MongoDBChatMessageHistory} from "@langchain/mongodb";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { Readable } from 'stream';
import {ObjectId} from "mongodb";

@Injectable()
export class ChatService {
  private ollama: Ollama;

  constructor(
    @InjectModel(ChatEntity.name)
    private readonly chatModel: Model<ChatEntity>,
  ) {
    this.ollama = new Ollama({
      baseUrl: "http://localhost:11434", // Default value
      model: "llama2", // Default value
    });
    mongoose.connect(process.env.MONGO_URI);
  }

  public async generateChatName(message: Message, onGenerated: (name: string) => void): Promise<void> {
    const history = new ChatMessageHistory();
    await history.addMessage(new SystemMessage(ChatNamePrompt));
    await history.addMessage(new HumanMessage(message.content));

    const name = await this.ollama.invoke(await history.getMessages());
    onGenerated(name)
  }

  public async prompt(input: string, sessionId?: string): Promise<Readable> {
    const stringParser = new StringOutputParser();
    const memory = new BufferMemory({
      chatHistory: new MongoDBChatMessageHistory({
        collection: mongoose.connection.db.collection("chat"),
        sessionId: sessionId || new ObjectId().toString(),
      }),
    });

    const chain = new ConversationChain({
      llm: this.ollama, memory: memory, outputParser: stringParser
    });
    const stream = await chain.stream({ input });

    // Create a readable stream
    return new Readable({
      read: async function (size) {
        const chunk = await stream.next();
        if (!chunk.done) {
          const {response} = chunk.value;
          this.push(response); // Push the next chunk to the stream
        } else {
          this.push(null); // End the stream
        }
      }
    });
  }

  public getChats(): Promise<Chat[]> {
    return this.chatModel.find().exec();
  }
}