import Dexie, { Table } from 'dexie';
import { Report, Question, Experience, Answer } from '../types';
import { v4 as uuidv4 } from 'uuid';

class CyberGuardDB extends Dexie {
  reports!: Table<Report>;
  questions!: Table<Question>;
  experiences!: Table<Experience>;

  constructor() {
    super('CyberGuardDB');
    
    this.version(1).stores({
      reports: 'id, userId, status, severity, timestamp, bullyingType',
      questions: 'id, userId, status, createdAt, title',
      experiences: 'id, userId, status, timestamp, title, likes'
    });

    // Add hooks for data validation and timestamps
    this.reports.hook('creating', (primKey, obj) => {
      obj.id = obj.id || uuidv4();
      obj.timestamp = obj.timestamp || new Date();
      obj.status = obj.status || 'pending';
      return obj;
    });

    this.questions.hook('creating', (primKey, obj) => {
      obj.id = obj.id || uuidv4();
      obj.createdAt = obj.createdAt || new Date();
      obj.status = obj.status || 'pending';
      obj.answers = obj.answers || [];
      return obj;
    });

    this.experiences.hook('creating', (primKey, obj) => {
      obj.id = obj.id || uuidv4();
      obj.timestamp = obj.timestamp || new Date();
      obj.status = obj.status || 'pending';
      obj.comments = obj.comments || [];
      obj.likes = obj.likes || 0;
      return obj;
    });
  }

  // Questions
  async addQuestion(question: Omit<Question, 'id' | 'createdAt' | 'answers' | 'status'>) {
    const newQuestion: Question = {
      id: uuidv4(),
      createdAt: new Date(),
      answers: [],
      status: 'pending',
      ...question
    };
    await this.questions.add(newQuestion);
    return newQuestion;
  }

  async getQuestionById(id: string) {
    return await this.questions.get(id);
  }

  async updateQuestion(id: string, updates: Partial<Question>) {
    await this.questions.update(id, updates);
  }

  async addAnswer(questionId: string, answer: Omit<Answer, 'id' | 'timestamp'>) {
    const question = await this.questions.get(questionId);
    if (!question) throw new Error('Question not found');

    const newAnswer: Answer = {
      id: uuidv4(),
      timestamp: new Date(),
      ...answer
    };

    question.answers.push(newAnswer);
    await this.questions.update(questionId, { answers: question.answers });
    return newAnswer;
  }

  // Experiences
  async addExperience(experience: Omit<Experience, 'id' | 'timestamp' | 'status' | 'comments' | 'likes'>) {
    const newExperience: Experience = {
      id: uuidv4(),
      timestamp: new Date(),
      status: 'pending',
      comments: [],
      likes: 0,
      ...experience
    };
    await this.experiences.add(newExperience);
    return newExperience;
  }

  async getExperienceById(id: string) {
    return await this.experiences.get(id);
  }

  async updateExperience(id: string, updates: Partial<Experience>) {
    await this.experiences.update(id, updates);
  }

  async updateExperienceStatus(id: string, status: 'approved' | 'rejected') {
    await this.experiences.update(id, { status });
  }

  // Reports
  async addReport(report: Omit<Report, 'id'>) {
    const id = await this.reports.add({
      ...report,
      id: uuidv4()
    } as Report);
    return id.toString();
  }

  async getReportsByLocation(city: string, state: string) {
    return await this.reports
      .filter(report => 
        report.location.city === city && 
        report.location.state === state
      )
      .toArray();
  }

  async getReportsByType(bullyingType: string) {
    return await this.reports
      .where('bullyingType')
      .equals(bullyingType)
      .toArray();
  }

  async getCriticalAreas() {
    const reports = await this.reports.toArray();
    const locationMap = new Map<string, { count: number; reports: Report[] }>();

    reports.forEach(report => {
      const key = `${report.location.city}, ${report.location.state}`;
      if (!locationMap.has(key)) {
        locationMap.set(key, { count: 0, reports: [] });
      }
      const location = locationMap.get(key)!;
      location.count++;
      location.reports.push(report);
    });

    return Array.from(locationMap.entries())
      .filter(([_, data]) => data.count >= 3)
      .map(([location, data]) => ({
        location,
        count: data.count,
        reports: data.reports
      }));
  }

  // Utility methods
  async clearAllData() {
    await Promise.all([
      this.reports.clear(),
      this.questions.clear(),
      this.experiences.clear()
    ]);
  }
}

export const db = new CyberGuardDB();