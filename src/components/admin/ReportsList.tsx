import React from 'react';
import { Report } from '../../types';
import { formatReportDate, getSeverityClass } from '../../utils/reportUtils';

interface ReportsListProps {
  reports: Report[];
}

const ReportsList: React.FC<ReportsListProps> = ({ reports }) => {
  return (
    <div className="bg-white rounded-lg">
      <h2 className="text-xl font-semibold mb-4">All Reports</h2>
      <div className="space-y-4">
        {reports && reports.length > 0 ? (
          reports.map((report) => (
            <div key={report.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-lg">{report.bullyingType}</h3>
                  <p className="text-sm text-gray-500">
                    {report.isAnonymous ? 'Anonymous Report' : `Reported by: ${report.name}`}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${getSeverityClass(report.severity)}`}>
                  {report.severity.toUpperCase()}
                </span>
              </div>

              <div className="space-y-2 text-gray-600">
                <p>
                  <span className="font-medium">Location:</span>{' '}
                  {[report.location.city, report.location.district, report.location.state]
                    .filter(Boolean)
                    .join(', ')}
                </p>
                <p>
                  <span className="font-medium">Platform:</span>{' '}
                  {report.perpetratorInfo.platform}
                </p>
                {report.perpetratorInfo.username && (
                  <p>
                    <span className="font-medium">Username:</span>{' '}
                    {report.perpetratorInfo.username}
                  </p>
                )}
                {report.evidenceLinks.length > 0 && (
                  <div>
                    <span className="font-medium">Evidence:</span>{' '}
                    <span className="text-indigo-600">
                      {report.evidenceLinks.length} attachments
                    </span>
                  </div>
                )}
                <p className="text-sm text-gray-500">
                  Reported on: {formatReportDate(report.timestamp)}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-8">
            No reports have been submitted yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default ReportsList;