import { db } from './db';
import { Question, Answer } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const qaService = {
  async getAllQuestions() {
    try {
      const questions = await db.questions.toArray();
      return questions.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (error) {
      console.error('Error fetching questions:', error);
      throw new Error('Failed to fetch questions');
    }
  },

  async addQuestion(questionData: Omit<Question, 'id' | 'createdAt' | 'answers' | 'status'>) {
    try {
      const newQuestion: Question = {
        id: uuidv4(),
        createdAt: new Date(),
        answers: [],
        status: 'pending',
        ...questionData
      };
      await db.questions.add(newQuestion);
      return newQuestion;
    } catch (error) {
      console.error('Error adding question:', error);
      throw new Error('Failed to add question');
    }
  },

  async addAnswer(questionId: string, answerData: Omit<Answer, 'id' | 'timestamp' | 'likes'>) {
    try {
      const question = await db.questions.get(questionId);
      if (!question) {
        throw new Error('Question not found');
      }

      const newAnswer: Answer = {
        id: uuidv4(),
        timestamp: new Date(),
        likes: 0,
        ...answerData
      };

      question.answers.push(newAnswer);
      await db.questions.update(questionId, { answers: question.answers });
      return newAnswer;
    } catch (error) {
      console.error('Error adding answer:', error);
      throw new Error('Failed to add answer');
    }
  },

  async likeAnswer(questionId: string, answerId: string) {
    try {
      const question = await db.questions.get(questionId);
      if (!question) {
        throw new Error('Question not found');
      }

      const answerIndex = question.answers.findIndex(a => a.id === answerId);
      if (answerIndex === -1) {
        throw new Error('Answer not found');
      }

      question.answers[answerIndex].likes += 1;
      await db.questions.update(questionId, { answers: question.answers });
    } catch (error) {
      console.error('Error liking answer:', error);
      throw new Error('Failed to like answer');
    }
  }
};