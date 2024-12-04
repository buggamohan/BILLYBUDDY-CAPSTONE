import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Report } from '../../types';
import ReportCard from '../dashboard/ReportCard';
import { Search } from 'lucide-react';

const UserReportsList: React.FC = () => {
  const { reports } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'reported' | 'resolved'>('all');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const filteredReports = reports.filter(report => {
    const matchesSearch = 
      report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.bullyingType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || report.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">User Reports</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="reported">Reported</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredReports.map(report => (
            <ReportCard
              key={report.id}
              report={report}
              onViewDetails={setSelectedReport}
            />
          ))}
        </div>

        {filteredReports.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No reports found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default UserReportsList;