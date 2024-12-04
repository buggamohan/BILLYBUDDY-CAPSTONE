import OpenAI from 'openai';
import { ChatMessage } from '../types';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export const openaiService = {
  async getChatResponse(messages: ChatMessage[]): Promise<string> {
    try {
      const formattedMessages = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are Billy, a friendly and empathetic anti-bullying assistant. Your goal is to help users report cyberbullying incidents and provide support and guidance. Always maintain a supportive and understanding tone."
          },
          ...formattedMessages
        ],
        temperature: 0.7,
        max_tokens: 150
      });

      return response.choices[0]?.message?.content || "I'm sorry, I couldn't process that request.";
    } catch (error) {
      console.error('OpenAI API Error:', error);
      return "I'm having trouble connecting right now. Please try again later.";
    }
  }
};