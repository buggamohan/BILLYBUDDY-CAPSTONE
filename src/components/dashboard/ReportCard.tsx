import React from 'react';
import { Report } from '../../types';
import { AlertTriangle, Clock, CheckCircle, ExternalLink } from 'lucide-react';
import { formatReportDate } from '../../utils/reportUtils';

interface ReportCardProps {
  report: Report;
  onViewDetails?: (report: Report) => void;
}

const ReportCard: React.FC<ReportCardProps> = ({ report, onViewDetails }) => {
  const getStatusIcon = () => {
    switch (report.status) {
      case 'resolved':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'reported':
        return <ExternalLink className="text-orange-500" size={20} />;
      default:
        return <Clock className="text-blue-500" size={20} />;
    }
  };

  const getStatusColor = () => {
    switch (report.status) {
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'reported':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getSeverityColor = () => {
    switch (report.severity) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <AlertTriangle className={
            report.severity === 'critical' ? 'text-red-500' :
            report.severity === 'high' ? 'text-orange-500' :
            'text-yellow-500'
          } />
          <h3 className="text-lg font-semibold">{report.bullyingType}</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor()}`}>
            {report.status}
          </span>
          <span className={`px-3 py-1 rounded-full text-sm ${getSeverityColor()}`}>
            {report.severity}
          </span>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <p className="text-gray-600">
          <span className="font-medium">Location:</span> {report.location.city}, {report.location.state}
        </p>
        <p className="text-gray-600">
          <span className="font-medium">Platform:</span> {report.perpetratorInfo.platform}
        </p>
        {report.perpetratorInfo.username && (
          <p className="text-gray-600">
            <span className="font-medium">Username:</span> {report.perpetratorInfo.username}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-gray-500">
          {getStatusIcon()}
          <span className="text-sm">
            Reported on {formatReportDate(report.timestamp)}
          </span>
        </div>
        {onViewDetails && (
          <button
            onClick={() => onViewDetails(report)}
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
          >
            View Details
          </button>
        )}
      </div>
    </div>
  );
};

export default ReportCard;