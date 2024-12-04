import { Report } from '../types';

export const formatReportDate = (timestamp: Date): string => {
  return new Date(timestamp).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getSeverityClass = (severity: string = 'low'): string => {
  switch (severity.toLowerCase()) {
    case 'high':
      return 'bg-red-100 text-red-700';
    case 'medium':
      return 'bg-yellow-100 text-yellow-700';
    default:
      return 'bg-blue-100 text-blue-700';
  }
};

export const getReportStatus = (report: Report): string => {
  switch (report.status) {
    case 'resolved':
      return 'bg-green-100 text-green-800';
    case 'reported':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const sortReportsByDate = (reports: Report[]): Report[] => {
  return [...reports].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
};