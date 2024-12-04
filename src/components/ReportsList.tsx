import React from 'react';
import { Report } from '../types';
import { AlertTriangle, MapPin } from 'lucide-react';
import { formatReportDate, getSeverityClass } from '../utils/reportUtils';

interface ReportsListProps {
  reports: Report[];
}

const ReportsList: React.FC<ReportsListProps> = ({ reports = [] }) => {
  return (
    <div className="bg-white rounded-lg shadow-xl p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Recent Reports</h2>
      <div className="space-y-4">
        {reports.length > 0 ? (
          reports.map((report) => (
            <div
              key={`${report.id}-${report.timestamp}`}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="text-red-500" />
                <span className="font-semibold">{report.bullyingType || 'Unknown Type'}</span>
                <span className={`px-2 py-1 rounded-full text-xs ${getSeverityClass(report.severity)}`}>
                  {(report.severity || 'low').toUpperCase()}
                </span>
              </div>
              <div className="flex items-start gap-2 text-gray-600 mb-2">
                <MapPin className="text-gray-400 mt-1" size={16} />
                <p>
                  {[
                    report.location?.city,
                    report.location?.district,
                    report.location?.state
                  ].filter(Boolean).join(', ') || 'Location not specified'}
                </p>
              </div>
              <p className="text-gray-600">
                Reported: {formatReportDate(report.timestamp)}
              </p>
              {report.perpetratorInfo?.platform && (
                <p className="text-gray-600">
                  Platform: {report.perpetratorInfo.platform}
                </p>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-4">
            No reports yet. Reports will appear here when submitted.
          </p>
        )}
      </div>
    </div>
  );
};

export default ReportsList;