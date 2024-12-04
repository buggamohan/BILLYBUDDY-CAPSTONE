import React from 'react';
import { useData } from '../../context/DataContext';
import CybercrimeMap from './CybercrimeMap';
import { Shield, AlertTriangle, MessageSquare, Users } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { reports, questions, experiences } = useData();

  const stats = {
    totalReports: reports.length,
    pendingReports: reports.filter(r => r.status === 'pending').length,
    criticalAreas: reports.filter(r => r.severity === 'high' || r.severity === 'critical').length,
    pendingQuestions: questions.filter(q => q.status === 'pending').length,
    pendingExperiences: experiences.filter(e => e.status === 'pending').length
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-indigo-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-600 font-semibold">Total Reports</p>
                <h3 className="text-2xl font-bold text-indigo-700">{stats.totalReports}</h3>
              </div>
              <Shield className="text-indigo-500" size={32} />
            </div>
          </div>

          <div className="bg-red-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-600 font-semibold">Critical Areas</p>
                <h3 className="text-2xl font-bold text-red-700">{stats.criticalAreas}</h3>
              </div>
              <AlertTriangle className="text-red-500" size={32} />
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 font-semibold">Pending Q&A</p>
                <h3 className="text-2xl font-bold text-blue-700">{stats.pendingQuestions}</h3>
              </div>
              <MessageSquare className="text-blue-500" size={32} />
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 font-semibold">Pending Stories</p>
                <h3 className="text-2xl font-bold text-purple-700">{stats.pendingExperiences}</h3>
              </div>
              <Users className="text-purple-500" size={32} />
            </div>
          </div>
        </div>

        <CybercrimeMap />
      </div>
    </div>
  );
};

export default AdminDashboard;