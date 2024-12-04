import React, { useState } from 'react';
import { Report } from '../types';
import { FileText, Send, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface AdminReportViewerProps {
  reports: Report[];
  onForwardToCybercrime: (report: Report) => void;
}

const AdminReportViewer: React.FC<AdminReportViewerProps> = ({ reports, onForwardToCybercrime }) => {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'reported' | 'resolved'>('all');

  const filteredReports = reports.filter(report => 
    filterStatus === 'all' ? true : report.status === filterStatus
  );

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-orange-600';
      case 'low': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved': return <CheckCircle className="text-green-500" size={20} />;
      case 'reported': return <AlertTriangle className="text-orange-500" size={20} />;
      case 'pending': return <Clock className="text-blue-500" size={20} />;
      default: return null;
    }
  };

  return (
    <div className="grid grid-cols-12 gap-6 h-[calc(100vh-6rem)]">
      <div className="col-span-4 bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Reports</h2>
          <div className="flex gap-2 mt-2">
            {(['all', 'pending', 'reported', 'resolved'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1 rounded-full text-sm ${
                  filterStatus === status
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-y-auto h-[calc(100%-5rem)]">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              onClick={() => setSelectedReport(report)}
              className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                selectedReport?.id === report.id ? 'bg-indigo-50' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getStatusIcon(report.status)}
                  <span className="font-medium">{report.bullyingType}</span>
                </div>
                <span className={`text-sm ${getSeverityColor(report.severity)}`}>
                  {report.severity.toUpperCase()}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-1">
                {report.location.city}, {report.location.state}
              </p>
              <p className="text-xs text-gray-500">
                {format(new Date(report.timestamp), 'MMM d, yyyy HH:mm')}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="col-span-8 bg-white rounded-lg shadow-lg overflow-hidden">
        {selectedReport ? (
          <div className="h-full flex flex-col">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Report Details</h2>
                {selectedReport.status !== 'reported' && (
                  <button
                    onClick={() => onForwardToCybercrime(selectedReport)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Send size={16} />
                    Forward to Cybercrime
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium capitalize">{selectedReport.status}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Severity</p>
                  <p className={`font-medium ${getSeverityColor(selectedReport.severity)}`}>
                    {selectedReport.severity.toUpperCase()}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Victim Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p>{selectedReport.isAnonymous ? 'Anonymous' : selectedReport.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Age</p>
                      <p>{selectedReport.age}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Incident Details</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Type of Bullying</p>
                      <p className="font-medium">{selectedReport.bullyingType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Platform</p>
                      <p>{selectedReport.perpetratorInfo.platform}</p>
                    </div>
                    {selectedReport.perpetratorInfo.username && (
                      <div>
                        <p className="text-sm text-gray-500">Perpetrator Username</p>
                        <p>{selectedReport.perpetratorInfo.username}</p>
                      </div>
                    )}
                  </div>
                </div>

                {selectedReport.evidenceLinks.length > 0 && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Evidence</h3>
                    <div className="space-y-2">
                      {selectedReport.evidenceLinks.map((link, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <FileText size={16} className="text-gray-400" />
                          <a
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:text-indigo-800"
                          >
                            View Evidence {index + 1}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            Select a report to view details
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReportViewer;