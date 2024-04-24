import {Types} from "mongoose";
import {ChatMessageType} from "../enums";

export interface Chat extends Document{
  sessionId: string;
  messages: ChatMessage[];
}

export interface ChatMessage extends Document{
  type: ChatMessageType;
  data: {
    content: string;
  }
}

export interface UserChatMessage extends Document{
  content: string;
}

export interface Document {
  _id?: string | Types.ObjectId;
  created_at: Date;
  updated_at: Date;
}

export interface Message extends Document {
  type: 'user' | 'assistant'
  content: string;
  chatId?: string
}

export interface ResponseError {
  statusCode: number;
  error: string;
  message?: string[];
}