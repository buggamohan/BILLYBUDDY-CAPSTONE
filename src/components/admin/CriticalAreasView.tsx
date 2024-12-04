import React from 'react';
import { Report } from '../../types';
import { useReportAnalysis } from '../../hooks/useReportAnalysis';
import { AlertTriangle, ExternalLink } from 'lucide-react';

interface CriticalAreasViewProps {
  reports: Report[];
}

const CriticalAreasView: React.FC<CriticalAreasViewProps> = ({ reports }) => {
  const { criticalAreas, handleReportToCybercrime } = useReportAnalysis(reports);

  const handleReport = async (reports: Report[], location: string) => {
    try {
      const result = await handleReportToCybercrime(reports, location);
      if (result?.success) {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error reporting to cybercrime:', error);
      alert('Failed to report to cybercrime authorities');
    }
  };

  if (!criticalAreas.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        No critical areas detected
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {criticalAreas.map((area) => (
        <div
          key={area.location}
          className="border rounded-lg p-4 bg-red-50"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="text-red-500" />
              <h3 className="font-semibold">{area.location}</h3>
              <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                {area.count} Reports
              </span>
            </div>
            <button
              onClick={() => handleReport(area.reports, area.location)}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <ExternalLink size={16} />
              Report to Cybercrime
            </button>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Incident Types:</h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(
                area.reports.reduce((acc: any, r: Report) => {
                  acc[r.bullyingType] = (acc[r.bullyingType] || 0) + 1;
                  return acc;
                }, {})
              ).map(([type, count]) => (
                <span
                  key={type}
                  className="px-3 py-1 bg-white text-red-600 rounded-full text-sm border border-red-200"
                >
                  {type}: {count}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CriticalAreasView;