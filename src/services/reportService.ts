import { Report } from '../types';
import { db } from './db';
import { cybercrimeService } from './cybercrimeService';
import { v4 as uuidv4 } from 'uuid';

class ReportService {
  async submitReport(reportData: Omit<Report, 'id' | 'status' | 'timestamp'>): Promise<Report> {
    try {
      const newReport: Omit<Report, 'id'> = {
        ...reportData,
        status: 'pending',
        timestamp: new Date()
      };

      const id = await db.addReport(newReport);
      const report = await db.reports.get(id);

      if (!report) {
        throw new Error('Failed to create report');
      }

      // Check if this creates a critical area
      const criticalArea = await this.checkCriticalArea(report);
      if (criticalArea.isCritical) {
        await cybercrimeService.reportToCybercrime(criticalArea.reports, 
          `${report.location.city}, ${report.location.state}`);
      }

      return report;
    } catch (error) {
      console.error('Error submitting report:', error);
      throw new Error('Failed to submit report');
    }
  }

  private async checkCriticalArea(report: Report) {
    const nearbyReports = await db.getReportsByLocation(
      report.location.city,
      report.location.state
    );

    return {
      isCritical: nearbyReports.length >= 3,
      reports: nearbyReports
    };
  }

  async getReportsByUser(userId: string): Promise<Report[]> {
    return await db.reports
      .where('userId')
      .equals(userId)
      .reverse()
      .sortBy('timestamp');
  }

  async getAllReports(): Promise<Report[]> {
    return await db.reports
      .orderBy('timestamp')
      .reverse()
      .toArray();
  }

  async updateReportStatus(reportId: string, status: Report['status']): Promise<void> {
    await db.reports.update(reportId, { status });
  }
}

export const reportService = new ReportService();