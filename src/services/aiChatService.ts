import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('AIzaSyBNKP4RV9Cq-MlwYPgn_Xo201YJzIs7Bzo');

export const aiChatService = {
  async getChatResponse(message: string): Promise<string> {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      
      const prompt = `As an AI counselor specializing in cyberbullying support, please respond to the following message: ${message}

      Focus on:
      - Providing emotional support
      - Offering practical advice
      - Suggesting safety measures
      - Encouraging positive actions`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini API Error:', error);
      return "I'm having trouble connecting right now. Please try again later.";
    }
  }
};