import React from 'react';
import { Report } from '../../types';

interface CriticalAreasProps {
  areas: {
    id: string;
    location: number[];
    count: number;
    reports: Report[];
    severity: string;
  }[];
  onReportToCybercrime: (reports: Report[], location: string) => void;
}

const CriticalAreas: React.FC<CriticalAreasProps> = ({ areas, onReportToCybercrime }) => {
  if (areas.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Critical Areas (Red Zones)</h2>
      <div className="space-y-4">
        {areas.map((area) => (
          <div key={area.id} className="border rounded-lg p-4 bg-red-50">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-lg">
                  Location: {area.reports[0].location.city}, {area.reports[0].location.state}
                </h3>
                <p className="text-red-600 font-semibold">
                  {area.count} Reports - {area.severity.toUpperCase()} SEVERITY
                </p>
              </div>
              <button
                onClick={() => onReportToCybercrime(
                  area.reports,
                  `${area.reports[0].location.city}, ${area.reports[0].location.state}`
                )}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Report to Cybercrime
              </button>
            </div>
            <div className="mt-2">
              <p className="font-medium mb-1">Incident Types:</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(
                  area.reports.reduce((acc, r) => {
                    acc[r.bullyingType] = (acc[r.bullyingType] || 0) + 1;
                    return acc;
                  }, {} as Record<string, number>)
                ).map(([type, count]) => (
                  <span
                    key={`${area.id}-${type}`}
                    className="bg-white px-3 py-1 rounded-full text-sm border border-red-200"
                  >
                    {type}: {count}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CriticalAreas;