import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Report } from '../../types';
import { BarChart2, MessageSquare, AlertTriangle, Clock } from 'lucide-react';
import ReportCard from './ReportCard';

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const { reports, questions, experiences } = useData();
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const userReports = reports.filter(r => r.userId === user?.id) || [];
  const userQuestions = questions.filter(q => q.userId === user?.id) || [];
  const userExperiences = experiences.filter(e => e.userId === user?.id) || [];

  const stats = {
    totalReports: userReports.length,
    pendingReports: userReports.filter(r => r.status === 'pending').length,
    resolvedReports: userReports.filter(r => r.status === 'resolved').length,
    questions: userQuestions.length,
    experiences: userExperiences.length
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h1 className="text-2xl font-bold mb-6">Welcome back, {user?.username}!</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-indigo-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-600 font-semibold">Total Reports</p>
                <h3 className="text-2xl font-bold text-indigo-700">{stats.totalReports}</h3>
              </div>
              <BarChart2 className="text-indigo-500" size={32} />
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-600 font-semibold">Pending</p>
                <h3 className="text-2xl font-bold text-yellow-700">{stats.pendingReports}</h3>
              </div>
              <Clock className="text-yellow-500" size={32} />
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 font-semibold">Resolved</p>
                <h3 className="text-2xl font-bold text-green-700">{stats.resolvedReports}</h3>
              </div>
              <AlertTriangle className="text-green-500" size={32} />
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 font-semibold">Q&A Activity</p>
                <h3 className="text-2xl font-bold text-purple-700">{stats.questions}</h3>
              </div>
              <MessageSquare className="text-purple-500" size={32} />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold mb-4">Your Reports</h2>
          {userReports.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userReports.map(report => (
                <ReportCard
                  key={report.id}
                  report={report}
                  onViewDetails={setSelectedReport}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              You haven't submitted any reports yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;