import React from 'react';
import { Report } from '../types';
import { AlertTriangle, ExternalLink } from 'lucide-react';

interface HotspotsListProps {
  hotspots: Record<string, { 
    reports: Report[], 
    count: number, 
    severity: 'low' | 'medium' | 'high' | 'critical' 
  }>;
  onReportToCybercrime: (reports: Report[], location: string) => void;
}

const HotspotsList: React.FC<HotspotsListProps> = ({ hotspots, onReportToCybercrime }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 border-red-500 text-red-700';
      case 'high': return 'bg-orange-100 border-orange-500 text-orange-700';
      case 'medium': return 'bg-yellow-100 border-yellow-500 text-yellow-700';
      default: return 'bg-gray-100 border-gray-500 text-gray-700';
    }
  };

  return (
    <div className="space-y-4">
      {Object.entries(hotspots)
        .filter(([, data]) => data.count >= 5)
        .sort(([, a], [, b]) => b.count - a.count)
        .map(([location, data]) => (
          <div 
            key={location} 
            className={`border rounded-lg p-4 ${getSeverityColor(data.severity)}`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="text-current" />
                <span className="font-semibold">{location}</span>
                <span className="px-2 py-1 rounded-full text-sm border border-current">
                  {data.count} Reports
                </span>
              </div>
              {data.count >= 5 && (
                <button
                  onClick={() => onReportToCybercrime(data.reports, location)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <ExternalLink size={16} />
                  Report to Cybercrime
                </button>
              )}
            </div>
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Bullying Types:</h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(
                  data.reports.reduce((acc, r) => {
                    acc[r.bullyingType] = (acc[r.bullyingType] || 0) + 1;
                    return acc;
                  }, {} as Record<string, number>)
                ).map(([type, count]) => (
                  <span
                    key={type}
                    className="bg-white px-3 py-1 rounded-full text-sm border"
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

export default HotspotsList;