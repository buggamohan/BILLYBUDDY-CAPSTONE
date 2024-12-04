import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { v4 as uuidv4 } from 'uuid';
import { Report, Question, Experience, Answer } from '../types';

interface CyberGuardDB extends DBSchema {
  reports: {
    key: string;
    value: Report;
    indexes: { 'by-user': string };
  };
  questions: {
    key: string;
    value: Question;
    indexes: { 'by-user': string; 'by-status': string };
  };
  experiences: {
    key: string;
    value: Experience;
    indexes: { 'by-user': string; 'by-status': string };
  };
}

class DatabaseService {
  private db: Promise<IDBPDatabase<CyberGuardDB>>;

  constructor() {
    this.db = this.initDB();
  }

  private async initDB() {
    return await openDB<CyberGuardDB>('cyberguard-db', 1, {
      upgrade(db) {
        // Reports store
        const reportsStore = db.createObjectStore('reports', { keyPath: 'id' });
        reportsStore.createIndex('by-user', 'userId');

        // Questions store
        const questionsStore = db.createObjectStore('questions', { keyPath: 'id' });
        questionsStore.createIndex('by-user', 'userId');
        questionsStore.createIndex('by-status', 'status');

        // Experiences store
        const experiencesStore = db.createObjectStore('experiences', { keyPath: 'id' });
        experiencesStore.createIndex('by-user', 'userId');
        experiencesStore.createIndex('by-status', 'status');
      }
    });
  }

  // Reports
  async createReport(report: Omit<Report, 'id'>): Promise<Report> {
    const db = await this.db;
    const newReport = { ...report, id: uuidv4() };
    await db.add('reports', newReport);
    return newReport;
  }

  async getReportsByUser(userId: string): Promise<Report[]> {
    const db = await this.db;
    return await db.getAllFromIndex('reports', 'by-user', userId);
  }

  async getAllReports(): Promise<Report[]> {
    const db = await this.db;
    return await db.getAll('reports');
  }

  // Questions
  async createQuestion(question: Omit<Question, 'id'>): Promise<Question> {
    const db = await this.db;
    const newQuestion = { 
      ...question, 
      id: uuidv4(),
      answers: [],
      status: 'pending'
    };
    await db.add('questions', newQuestion);
    return newQuestion;
  }

  async getQuestionsByUser(userId: string): Promise<Question[]> {
    const db = await this.db;
    return await db.getAllFromIndex('questions', 'by-user', userId);
  }

  async getAllQuestions(): Promise<Question[]> {
    const db = await this.db;
    return await db.getAllFromIndex('questions', 'by-status', 'approved');
  }

  async addAnswer(questionId: string, answer: Omit<Answer, 'id'>): Promise<void> {
    const db = await this.db;
    const question = await db.get('questions', questionId);
    if (question) {
      const newAnswer = { ...answer, id: uuidv4() };
      question.answers.push(newAnswer);
      await db.put('questions', question);
    }
  }

  // Experiences
  async createExperience(experience: Omit<Experience, 'id'>): Promise<Experience> {
    const db = await this.db;
    const newExperience = {
      ...experience,
      id: uuidv4(),
      status: 'pending' as const
    };
    await db.add('experiences', newExperience);
    return newExperience;
  }

  async getExperiencesByUser(userId: string): Promise<Experience[]> {
    const db = await this.db;
    return await db.getAllFromIndex('experiences', 'by-user', userId);
  }

  async getAllExperiences(): Promise<Experience[]> {
    const db = await this.db;
    return await db.getAllFromIndex('experiences', 'by-status', 'approved');
  }

  async getPendingExperiences(): Promise<Experience[]> {
    const db = await this.db;
    return await db.getAllFromIndex('experiences', 'by-status', 'pending');
  }

  async updateExperienceStatus(id: string, status: 'approved' | 'rejected'): Promise<void> {
    const db = await this.db;
    const experience = await db.get('experiences', id);
    if (experience) {
      experience.status = status;
      await db.put('experiences', experience);
    }
  }
}

export const databaseService = new DatabaseService();