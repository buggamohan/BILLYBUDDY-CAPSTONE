import { useState, useEffect } from 'react';
import { Report } from '../types';
import { reportAnalysisService } from '../services/reportAnalysisService';
import { cybercrimeService } from '../services/cybercrimeService';

export function useReportAnalysis(reports: Report[]) {
  const [criticalAreas, setCriticalAreas] = useState<any[]>([]);
  const [criticalTypes, setCriticalTypes] = useState<any[]>([]);

  useEffect(() => {
    if (Array.isArray(reports) && reports.length > 0) {
      setCriticalAreas(reportAnalysisService.analyzeCriticalAreas(reports));
      setCriticalTypes(reportAnalysisService.analyzeByBullyingType(reports));
    }
  }, [reports]);

  const handleReportToCybercrime = async (reports: Report[], location: string) => {
    if (cybercrimeService.shouldReportToCybercrime(reports)) {
      return await cybercrimeService.reportToCybercrime(reports, location);
    }
    return null;
  };

  return {
    criticalAreas,
    criticalTypes,
    handleReportToCybercrime
  };
}