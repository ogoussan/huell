import {Injectable, NotFoundException} from "@nestjs/common";
import mongoose, {Model} from "mongoose";
import {ChatEntity} from "./chat.entity";
import {Chat} from "../../interfaces";
import {InjectModel} from "@nestjs/mongoose";
import { OllamaFunctions } from "langchain/experimental/chat_models/ollama_functions";
import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";
import {MongoDBChatMessageHistory} from "@langchain/mongodb";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { JsonOutputFunctionsParser } from 'langchain/output_parsers';
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from '@langchain/core/runnables';
import { Readable } from 'stream';
import {ObjectId} from "mongodb";
import {ChatNamePromptTemplate, ChatNameSchema} from "./chat.prompt";
import { zodToJsonSchema } from 'zod-to-json-schema';

@Injectable()
export class ChatService {
  private ollama: OllamaFunctions;

  constructor(
    @InjectModel(ChatEntity.name)
    private readonly chatModel: Model<ChatEntity>,
  ) {
    this.ollama = new OllamaFunctions({
      baseUrl: "http://localhost:11434", // Default value
      model: "llama3", // Default value
    });
    mongoose.connect(process.env.MONGO_URI);
  }

  public async generateChatName(input: string): Promise<string> {
    const jsonOutputFunctionParser = new JsonOutputFunctionsParser<
      Partial<{topic: string}>
    >({ diff: true });
    const prompt = PromptTemplate.fromTemplate(ChatNamePromptTemplate);
    const chain = RunnableSequence.from([
      prompt,
      this.ollama.bind({
        functions: [
          {
            name: 'getTopic',
            description: '',
            parameters: zodToJsonSchema(ChatNameSchema),
          },
        ],
        function_call: {
          name: 'getTopic',
        },
      }),
      jsonOutputFunctionParser
    ])

    const result = await chain.invoke({input});

    return result.topic;
  }

  public async prompt(input: string, sessionId?: string): Promise<Readable> {
    const stringParser = new StringOutputParser();
    const newSessionId = new ObjectId().toString();
    const memory = new BufferMemory({
      chatHistory: new MongoDBChatMessageHistory({
        collection: mongoose.connection.db.collection("chat"),
        sessionId: sessionId || newSessionId,
      }),
    });

    const chain = new ConversationChain({
      llm: this.ollama, memory: memory, outputParser: stringParser
    });
    const stream = await chain.stream({ input });

    // Set chat name
    if (!sessionId) {
      const name = await this.generateChatName(input);
      const result = await this.chatModel.findOneAndUpdate({sessionId: newSessionId }, {name}).exec();

      if (!result) {
        throw new NotFoundException(`Could not find newly created chat with sessionId ${newSessionId}`)
      }
    }

    // Create a readable stream
    return new Readable({
      read: async function () {
        try {
          const chunk = await stream.next();
          if (!chunk.done) {
            const {response} = chunk.value;
            console.log('writing...', response);
            this.push(response); // Push the next chunk to the stream
          } else {
            this.push(null); // End the stream
          }
        } catch (error) {
          console.error('Error occurred while streaming:', error);
          this.push(null); // End the stream on error
        }
      }
    });
  }

  public getChats(): Promise<Chat[]> {
    return this.chatModel.find().exec();
  }

  public deleteChatById(id: string): Promise<Chat> {
    return this.chatModel.findByIdAndDelete(id).exec();
  }

  public async deleteChatBySessionId(sessionId: string): Promise<boolean> {
    const result = await this.chatModel.findOneAndDelete({sessionId}).exec();

    if (!result) {
      throw new NotFoundException([`Chat with sessionId ${sessionId} not found`]);
    }

    return true;
  }
}