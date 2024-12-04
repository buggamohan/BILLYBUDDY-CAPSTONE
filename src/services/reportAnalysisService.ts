import { Report } from '../types';

export const reportAnalysisService = {
  analyzeCriticalAreas(reports: Report[]) {
    const locationMap = new Map<string, { count: number; reports: Report[] }>();

    reports.forEach(report => {
      const locationKey = `${report.location.city}-${report.location.district}-${report.location.state}`;
      if (!locationMap.has(locationKey)) {
        locationMap.set(locationKey, { count: 0, reports: [] });
      }
      const location = locationMap.get(locationKey)!;
      location.count++;
      location.reports.push(report);
    });

    const criticalAreas = Array.from(locationMap.entries())
      .filter(([_, data]) => data.count >= 3)
      .map(([location, data]) => ({
        location,
        count: data.count,
        reports: data.reports,
        severity: this.calculateSeverity(data.count)
      }));

    return criticalAreas;
  },

  analyzeByBullyingType(reports: Report[]) {
    const typeMap = new Map<string, number>();
    reports.forEach(report => {
      const count = typeMap.get(report.bullyingType) || 0;
      typeMap.set(report.bullyingType, count + 1);
    });

    return Array.from(typeMap.entries())
      .filter(([_, count]) => count >= 3)
      .map(([type, count]) => ({
        type,
        count,
        severity: this.calculateSeverity(count)
      }));
  },

  calculateSeverity(count: number): 'low' | 'medium' | 'high' | 'critical' {
    if (count >= 10) return 'critical';
    if (count >= 7) return 'high';
    if (count >= 3) return 'medium';
    return 'low';
  }
};