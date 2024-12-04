import React, { createContext, useContext, useState, useEffect } from 'react';
import { Report, Question, Experience, Answer } from '../types';
import { db } from '../services/db';
import { useAuth } from './AuthContext';
import { reportService } from '../services/reportService';
import { cybercrimeService } from '../services/cybercrimeService';

interface DataContextType {
  reports: Report[];
  questions: Question[];
  experiences: Experience[];
  addReport: (reportData: Omit<Report, 'id' | 'status' | 'timestamp'>) => Promise<void>;
  addQuestion: (questionData: Omit<Question, 'id' | 'status' | 'createdAt' | 'answers'>) => Promise<void>;
  addExperience: (experienceData: Omit<Experience, 'id' | 'status' | 'timestamp'>) => Promise<void>;
  addAnswer: (questionId: string, answerData: Omit<Answer, 'id' | 'timestamp'>) => Promise<void>;
  updateExperienceStatus: (id: string, status: 'approved' | 'rejected') => Promise<void>;
  checkCriticalAreas: () => Promise<void>;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);

  const refreshData = async () => {
    try {
      const [allReports, allQuestions, allExperiences] = await Promise.all([
        reportService.getAllReports(),
        db.questions.toArray(),
        db.experiences.toArray()
      ]);

      setReports(allReports);
      setQuestions(allQuestions);
      setExperiences(allExperiences);
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const checkCriticalAreas = async () => {
    try {
      const criticalAreas = await cybercrimeService.analyzeCriticalAreas();
      
      for (const area of criticalAreas) {
        if (area.criticalTypes.length > 0) {
          const locationReports = await db.getReportsByLocation(
            area.location.split(',')[0].trim(),
            area.location.split(',')[1].trim()
          );
          
          if (cybercrimeService.shouldReportToCybercrime(locationReports)) {
            await cybercrimeService.reportToCybercrime(locationReports, area.location);
          }
        }
      }
    } catch (error) {
      console.error('Error checking critical areas:', error);
    }
  };

  const addReport = async (reportData: Omit<Report, 'id' | 'status' | 'timestamp'>) => {
    try {
      const report = await reportService.submitReport(reportData);
      await refreshData();
      await checkCriticalAreas();
      return report;
    } catch (error) {
      console.error('Error adding report:', error);
      throw error;
    }
  };

  const addQuestion = async (questionData: Omit<Question, 'id' | 'status' | 'createdAt' | 'answers'>) => {
    try {
      await db.addQuestion(questionData);
      await refreshData();
    } catch (error) {
      console.error('Error adding question:', error);
      throw error;
    }
  };

  const addExperience = async (experienceData: Omit<Experience, 'id' | 'status' | 'timestamp'>) => {
    try {
      await db.addExperience(experienceData);
      await refreshData();
    } catch (error) {
      console.error('Error adding experience:', error);
      throw error;
    }
  };

  const addAnswer = async (questionId: string, answerData: Omit<Answer, 'id' | 'timestamp'>) => {
    try {
      await db.addAnswer(questionId, answerData);
      await refreshData();
    } catch (error) {
      console.error('Error adding answer:', error);
      throw error;
    }
  };

  const updateExperienceStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await db.updateExperienceStatus(id, status);
      await refreshData();
    } catch (error) {
      console.error('Error updating experience status:', error);
      throw error;
    }
  };

  return (
    <DataContext.Provider value={{
      reports,
      questions,
      experiences,
      addReport,
      addQuestion,
      addExperience,
      addAnswer,
      updateExperienceStatus,
      checkCriticalAreas,
      refreshData
    }}>
      {children}
    </DataContext.Provider>
  );
};