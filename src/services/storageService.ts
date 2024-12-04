import { Report, Story, Question, Experience } from '../types';

const STORAGE_KEYS = {
  REPORTS: 'cyberguard_reports',
  STORIES: 'cyberguard_stories',
  QUESTIONS: 'cyberguard_questions',
  EXPERIENCES: 'cyberguard_experiences'
};

export const storageService = {
  // Reports
  saveReport(report: Report) {
    const reports = this.getReports();
    reports.push(report);
    this.saveReports(reports);
  },

  saveReports(reports: Report[]) {
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
  },

  getReports(): Report[] {
    const reportsJson = localStorage.getItem(STORAGE_KEYS.REPORTS);
    return reportsJson ? JSON.parse(reportsJson) : [];
  },

  updateReport(updatedReport: Report) {
    const reports = this.getReports();
    const index = reports.findIndex(r => r.id === updatedReport.id);
    if (index !== -1) {
      reports[index] = updatedReport;
      this.saveReports(reports);
    }
  },

  // Stories
  saveStory(story: Story) {
    const stories = this.getStories();
    stories.push(story);
    localStorage.setItem(STORAGE_KEYS.STORIES, JSON.stringify(stories));
  },

  getStories(): Story[] {
    const storiesJson = localStorage.getItem(STORAGE_KEYS.STORIES);
    return storiesJson ? JSON.parse(storiesJson) : [];
  },

  updateStory(updatedStory: Story) {
    const stories = this.getStories();
    const index = stories.findIndex(s => s.id === updatedStory.id);
    if (index !== -1) {
      stories[index] = updatedStory;
      localStorage.setItem(STORAGE_KEYS.STORIES, JSON.stringify(stories));
    }
  },

  // Questions
  saveQuestion(question: Question) {
    const questions = this.getQuestions();
    questions.push(question);
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
  },

  getQuestions(): Question[] {
    const questionsJson = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
    return questionsJson ? JSON.parse(questionsJson) : [];
  },

  updateQuestion(updatedQuestion: Question) {
    const questions = this.getQuestions();
    const index = questions.findIndex(q => q.id === updatedQuestion.id);
    if (index !== -1) {
      questions[index] = updatedQuestion;
      localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
    }
  },

  // Experiences
  saveExperience(experience: Experience) {
    const experiences = this.getExperiences();
    experiences.push(experience);
    localStorage.setItem(STORAGE_KEYS.EXPERIENCES, JSON.stringify(experiences));
  },

  getExperiences(): Experience[] {
    const experiencesJson = localStorage.getItem(STORAGE_KEYS.EXPERIENCES);
    return experiencesJson ? JSON.parse(experiencesJson) : [];
  },

  updateExperience(updatedExperience: Experience) {
    const experiences = this.getExperiences();
    const index = experiences.findIndex(e => e.id === updatedExperience.id);
    if (index !== -1) {
      experiences[index] = updatedExperience;
      localStorage.setItem(STORAGE_KEYS.EXPERIENCES, JSON.stringify(experiences));
    }
  },

  // Utility functions
  clearAll() {
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
  },

  getReportsByLocation(lat: number, lng: number, radiusKm: number = 1): Report[] {
    const reports = this.getReports();
    return reports.filter(report => {
      const distance = Math.sqrt(
        Math.pow(report.location.lat - lat, 2) + Math.pow(report.location.lng - lng, 2)
      );
      return distance <= radiusKm / 111.32; // Convert km to degrees (approximately)
    });
  }
};