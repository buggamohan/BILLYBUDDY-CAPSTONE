import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Report } from '../types';
import { BarChart2, MessageSquare, Users, Clock, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import ReportsList from './ReportsList';
import { useData } from '../context/DataContext';

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const { reports } = useData();
  const [selectedTab, setSelectedTab] = useState<'overview' | 'reports' | 'community'>('overview');

  const userReports = reports.filter(r => r.userId === user?.id) || [];
  const pendingReports = userReports.filter(r => r.status === 'pending').length;
  const resolvedReports = userReports.filter(r => r.status === 'resolved').length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Welcome back, {user?.username}!</h1>
            <p className="text-gray-600">Here's an overview of your reports and activities</p>
          </div>
          <Link
            to="/"
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            New Report
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 font-semibold">Total Reports</p>
                <h3 className="text-3xl font-bold text-blue-700">{userReports.length}</h3>
              </div>
              <BarChart2 className="text-blue-500" size={32} />
            </div>
          </div>

          <div className="bg-green-50 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 font-semibold">Resolved</p>
                <h3 className="text-3xl font-bold text-green-700">{resolvedReports}</h3>
              </div>
              <MessageSquare className="text-green-500" size={32} />
            </div>
          </div>

          <div className="bg-purple-50 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 font-semibold">Pending</p>
                <h3 className="text-3xl font-bold text-purple-700">{pendingReports}</h3>
              </div>
              <Clock className="text-purple-500" size={32} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="border-b">
          <nav className="flex">
            <button
              onClick={() => setSelectedTab('overview')}
              className={`px-6 py-4 text-sm font-medium ${
                selectedTab === 'overview'
                  ? 'border-b-2 border-indigo-500 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setSelectedTab('reports')}
              className={`px-6 py-4 text-sm font-medium ${
                selectedTab === 'reports'
                  ? 'border-b-2 border-indigo-500 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              My Reports
            </button>
            <button
              onClick={() => setSelectedTab('community')}
              className={`px-6 py-4 text-sm font-medium ${
                selectedTab === 'community'
                  ? 'border-b-2 border-indigo-500 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Community
            </button>
          </nav>
        </div>

        <div className="p-6">
          {selectedTab === 'overview' && (
            <div className="space-y-6">
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                {userReports.slice(0, 5).map((report) => (
                  <div key={report.id} className="flex items-center justify-between py-3 border-b last:border-0">
                    <div>
                      <p className="font-medium">{report.bullyingType}</p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(report.timestamp), 'MMM d, yyyy')}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        report.status === 'resolved'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {report.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedTab === 'reports' && (
            <ReportsList reports={userReports} />
          )}

          {selectedTab === 'community' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-4">Support Groups</h3>
                  <div className="space-y-4">
                    {['Cyberbullying Survivors', 'Parents Support', 'Teen Support Network'].map((group) => (
                      <div key={group} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{group}</p>
                          <p className="text-sm text-gray-500">Join the discussion</p>
                        </div>
                        <ChevronRight className="text-gray-400" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-4">Resources</h3>
                  <div className="space-y-4">
                    {[
                      'Digital Safety Guide',
                      'Mental Health Support',
                      'Legal Rights & Information'
                    ].map((resource) => (
                      <div key={resource} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{resource}</p>
                          <p className="text-sm text-gray-500">Download PDF</p>
                        </div>
                        <ChevronRight className="text-gray-400" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;