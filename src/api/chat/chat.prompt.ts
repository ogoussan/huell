import { z } from 'zod';

export const AIAssistantPrompt = 'You are a helpful AI assistant.'
export const ChatNamePromptTemplate = 'Please provide the topic of the conversation. This is the very first message of a conversation: "{input}"'

export const ChatNameSchema: z.ZodSchema<Partial<{ topic: string }>> = z.object({
  topic: z.string().describe('Topic of conversation'),
});
