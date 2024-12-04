import React from 'react';
import { Report } from '../types';
import { BarChart, PieChart, Activity } from 'lucide-react';

interface StatisticsProps {
  reports: Report[];
}

const Statistics: React.FC<StatisticsProps> = ({ reports = [] }) => {
  const getStatsByType = () => {
    return (Array.isArray(reports) ? reports : []).reduce((acc, report) => {
      acc[report.bullyingType] = (acc[report.bullyingType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  };

  const getSeverityStats = () => {
    return (Array.isArray(reports) ? reports : []).reduce((acc, report) => {
      acc[report.severity] = (acc[report.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  };

  const getMonthlyTrend = () => {
    const last6Months = new Array(6).fill(0).map((_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return date.toLocaleString('default', { month: 'short' });
    }).reverse();

    const trends = last6Months.reduce((acc, month) => {
      acc[month] = 0;
      return acc;
    }, {} as Record<string, number>);

    (Array.isArray(reports) ? reports : []).forEach(report => {
      const month = new Date(report.timestamp).toLocaleString('default', { month: 'short' });
      if (trends[month] !== undefined) {
        trends[month]++;
      }
    });

    return trends;
  };

  const typeStats = getStatsByType();
  const severityStats = getSeverityStats();
  const monthlyTrends = getMonthlyTrend();

  return (
    <div className="bg-white rounded-lg shadow-xl p-6">
      <h2 className="text-2xl font-bold mb-6">Cyberbullying Statistics</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="text-blue-500" />
            <h3 className="font-semibold">Types of Cyberbullying</h3>
          </div>
          <div className="space-y-2">
            {Object.entries(typeStats).map(([type, count]) => (
              <div key={type} className="flex justify-between items-center">
                <span>{type}</span>
                <span className="font-semibold">{count} cases</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <BarChart className="text-red-500" />
            <h3 className="font-semibold">Severity Distribution</h3>
          </div>
          <div className="space-y-2">
            {Object.entries(severityStats).map(([severity, count]) => (
              <div key={severity} className="flex justify-between items-center">
                <span className="capitalize">{severity}</span>
                <span className="font-semibold">{count} cases</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="text-green-500" />
            <h3 className="font-semibold">Monthly Trends</h3>
          </div>
          <div className="space-y-2">
            {Object.entries(monthlyTrends).map(([month, count]) => (
              <div key={month} className="flex justify-between items-center">
                <span>{month}</span>
                <span className="font-semibold">{count} reports</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;