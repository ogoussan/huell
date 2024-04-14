import {Types} from "mongoose";

export interface Document {
  _id?: string | Types.ObjectId;
  created_at: Date;
  updated_at: Date;
}

export interface Chat extends Document{
  name: string;
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