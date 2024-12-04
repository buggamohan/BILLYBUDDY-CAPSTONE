import { Report } from '../types';
import { db } from './db';

class CybercrimeService {
  private readonly CYBERCRIME_PORTAL_URL = 'https://cybercrime.gov.in/';

  async reportToCybercrime(reports: Report[], location: string) {
    try {
      // Group reports by type
      const reportsByType = reports.reduce((acc, report) => {
        if (!acc[report.bullyingType]) {
          acc[report.bullyingType] = [];
        }
        acc[report.bullyingType].push(report);
        return acc;
      }, {} as Record<string, Report[]>);

      // Check for critical patterns
      const criticalPatterns = Object.entries(reportsByType)
        .filter(([_, typeReports]) => typeReports.length >= 3);

      if (criticalPatterns.length === 0) {
        return {
          success: false,
          message: 'No critical patterns found for cybercrime reporting'
        };
      }

      // Update report statuses
      await Promise.all(
        reports.map(async (report) => {
          await db.reports.update(report.id, {
            status: 'reported',
            timestamp: new Date()
          });
        })
      );

      const summary = criticalPatterns
        .map(([type, reports]) => `${reports.length} cases of ${type}`)
        .join(', ');

      return {
        success: true,
        reportedCount: reports.length,
        message: `Reported to cybercrime authorities: ${summary} in ${location}`,
        portalUrl: this.CYBERCRIME_PORTAL_URL,
        criticalPatterns
      };
    } catch (error) {
      console.error('Error reporting to cybercrime:', error);
      throw new Error('Failed to report to cybercrime authorities');
    }
  }

  async analyzeCriticalAreas() {
    try {
      const criticalAreas = await db.getCriticalAreas();
      
      const analysisResults = await Promise.all(
        criticalAreas.map(async ({ location, reports }) => {
          const reportsByType = reports.reduce((acc, report) => {
            if (!acc[report.bullyingType]) {
              acc[report.bullyingType] = [];
            }
            acc[report.bullyingType].push(report);
            return acc;
          }, {} as Record<string, Report[]>);

          const criticalTypes = Object.entries(reportsByType)
            .filter(([_, reports]) => reports.length >= 3)
            .map(([type, reports]) => ({
              type,
              count: reports.length,
              severity: this.calculateSeverity(reports.length)
            }));

          return {
            location,
            criticalTypes,
            totalReports: reports.length,
            severity: this.calculateSeverity(reports.length)
          };
        })
      );

      return analysisResults;
    } catch (error) {
      console.error('Error analyzing critical areas:', error);
      throw new Error('Failed to analyze critical areas');
    }
  }

  private calculateSeverity(count: number): 'low' | 'medium' | 'high' | 'critical' {
    if (count >= 10) return 'critical';
    if (count >= 7) return 'high';
    if (count >= 3) return 'medium';
    return 'low';
  }

  shouldReportToCybercrime(reports: Report[]): boolean {
    if (!Array.isArray(reports) || reports.length < 3) return false;
    
    // Check for patterns in location and type
    const locationTypeMap = new Map<string, number>();
    
    reports.forEach(report => {
      const key = `${report.location.city}-${report.location.state}-${report.bullyingType}`;
      locationTypeMap.set(key, (locationTypeMap.get(key) || 0) + 1);
    });

    // Return true if any location-type combination has 3 or more reports
    return Array.from(locationTypeMap.values()).some(count => count >= 3);
  }
}

export const cybercrimeService = new CybercrimeService();