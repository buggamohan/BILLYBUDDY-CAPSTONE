import React, { useState } from 'react';
import { Report } from '../../../types';
import { AlertTriangle, MapPin, ExternalLink } from 'lucide-react';
import { formatReportDate, getSeverityClass } from '../../../utils/reportUtils';
import { reportService } from '../../../services/reportService';

interface ReportsViewerProps {
  reports: Report[];
}

const ReportsViewer: React.FC<ReportsViewerProps> = ({ reports }) => {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const handleReportToCybercrime = (report: Report) => {
    reportService.reportToCybercrime([report]);
    // Refresh the reports list through context if needed
  };

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-5 border rounded-lg overflow-hidden">
        <div className="p-4 border-b bg-gray-50">
          <h2 className="font-semibold">Reports List</h2>
        </div>
        <div className="overflow-y-auto max-h-[calc(100vh-300px)]">
          {reports.map((report) => (
            <div
              key={report.id}
              onClick={() => setSelectedReport(report)}
              className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                selectedReport?.id === report.id ? 'bg-indigo-50' : ''
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className={
                  report.severity === 'high' ? 'text-red-500' : 
                  report.severity === 'medium' ? 'text-orange-500' : 
                  'text-blue-500'
                } size={16} />
                <span className="font-medium">{report.bullyingType}</span>
                <span className={`ml-auto px-2 py-0.5 rounded-full text-xs ${getSeverityClass(report.severity)}`}>
                  {report.severity.toUpperCase()}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                {formatReportDate(report.timestamp)}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="col-span-7 border rounded-lg">
        {selectedReport ? (
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-semibold">Report Details</h2>
              <button
                onClick={() => handleReportToCybercrime(selectedReport)}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <ExternalLink size={16} />
                Forward to Cybercrime
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500">Type</label>
                  <p className="font-medium">{selectedReport.bullyingType}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Severity</label>
                  <p className={`font-medium ${getSeverityClass(selectedReport.severity)}`}>
                    {selectedReport.severity.toUpperCase()}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-500">Location</label>
                <div className="flex items-start gap-2 mt-1">
                  <MapPin className="text-gray-400 mt-1" size={16} />
                  <p className="text-gray-600">
                    {[
                      selectedReport.location.city,
                      selectedReport.location.district,
                      selectedReport.location.state
                    ].filter(Boolean).join(', ')}
                  </p>
                </div>
              </div>

              {selectedReport.perpetratorInfo && (
                <div>
                  <label className="text-sm text-gray-500">Perpetrator Information</label>
                  <div className="mt-1 space-y-2">
                    <p><span className="font-medium">Platform:</span> {selectedReport.perpetratorInfo.platform}</p>
                    {selectedReport.perpetratorInfo.username && (
                      <p><span className="font-medium">Username:</span> {selectedReport.perpetratorInfo.username}</p>
                    )}
                  </div>
                </div>
              )}

              {selectedReport.evidenceLinks.length > 0 && (
                <div>
                  <label className="text-sm text-gray-500">Evidence</label>
                  <div className="mt-1 space-y-2">
                    {selectedReport.evidenceLinks.map((link, index) => (
                      <a
                        key={index}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-800 flex items-center gap-2"
                      >
                        Evidence {index + 1}
                        <ExternalLink size={14} />
                      </a>
                    ))}
                  </div>
                </div>
              )}
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

export default ReportsViewer;