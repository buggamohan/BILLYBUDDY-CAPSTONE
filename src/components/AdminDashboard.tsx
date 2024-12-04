import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { reportService } from '../services/reportService';
import { Report } from '../types';
import { v4 as uuidv4 } from 'uuid';
import StatisticsCards from './admin/StatisticsCards';
import CriticalAreas from './admin/CriticalAreas';
import ReportsList from './admin/ReportsList';

const AdminDashboard: React.FC = () => {
  const { reports } = useData();
  const [criticalAreas, setCriticalAreas] = useState<{
    location: number[];
    count: number;
    reports: Report[];
    severity: string;
    id: string;
  }[]>([]);

  useEffect(() => {
    if (reports) {
      const areas = reportService.getCriticalAreas();
      const areasWithIds = areas.map(area => ({
        ...area,
        id: uuidv4()
      }));
      setCriticalAreas(areasWithIds);
    }
  }, [reports]);

  const handleReportToCybercrime = async (reports: Report[], location: string) => {
    try {
      const result = reportService.reportToCybercrime(reports);
      if (result.success) {
        alert(`Successfully reported ${result.reportedCount} incidents from ${location} to cybercrime authorities.`);
      }
    } catch (error) {
      console.error('Error reporting to cybercrime:', error);
      alert('Failed to report to cybercrime authorities. Please try again.');
    }
  };

  const getStatistics = () => {
    if (!reports) return { total: 0, anonymous: 0, identified: 0 };
    
    return {
      total: reports.length,
      anonymous: reports.filter(r => r.isAnonymous).length,
      identified: reports.filter(r => !r.isAnonymous).length
    };
  };

  const stats = getStatistics();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
        
        <StatisticsCards
          total={stats.total}
          identified={stats.identified}
          anonymous={stats.anonymous}
        />

        <CriticalAreas
          areas={criticalAreas}
          onReportToCybercrime={handleReportToCybercrime}
        />

        <ReportsList reports={reports || []} />
      </div>
    </div>
  );
};

export default AdminDashboard;