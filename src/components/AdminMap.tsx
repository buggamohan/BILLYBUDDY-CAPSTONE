import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { Report } from '../types';
import { MAP_CONFIG } from '../config/mapConfig';
import 'leaflet/dist/leaflet.css';

interface AdminMapProps {
  reports: Report[];
  hotspots: any[];
  onReportToCybercrime: (report: Report) => void;
}

const AdminMap: React.FC<AdminMapProps> = ({ reports = [], hotspots = [], onReportToCybercrime }) => {
  const getMarkerColor = (count: number) => {
    if (count >= 10) return '#FF0000';
    if (count >= 7) return '#FF4500';
    if (count >= 3) return '#FFA500';
    return '#2196F3';
  };

  // Group reports by location
  const locationGroups = reports.reduce((acc, report) => {
    const key = `${report.location.lat.toFixed(4)},${report.location.lng.toFixed(4)}`;
    if (!acc[key]) {
      acc[key] = {
        reports: [],
        count: 0,
        location: report.location
      };
    }
    acc[key].reports.push(report);
    acc[key].count++;
    return acc;
  }, {} as Record<string, { reports: Report[], count: number, location: Report['location'] }>);

  return (
    <MapContainer
      center={[MAP_CONFIG.center[0], MAP_CONFIG.center[1]]}
      zoom={MAP_CONFIG.zoom}
      className="h-full rounded-lg overflow-hidden"
      maxBounds={[
        [MAP_CONFIG.bounds.south, MAP_CONFIG.bounds.west],
        [MAP_CONFIG.bounds.north, MAP_CONFIG.bounds.east]
      ]}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {Object.values(locationGroups).map(({ reports, count, location }) => (
        <CircleMarker
          key={`${location.lat}-${location.lng}`}
          center={[location.lat, location.lng]}
          radius={Math.min(count * 3, 20)}
          fillColor={getMarkerColor(count)}
          color={getMarkerColor(count)}
          weight={2}
          opacity={0.8}
          fillOpacity={0.4}
        >
          <Popup>
            <div className="p-4">
              <h3 className="font-bold text-lg mb-2">
                {location.city || location.district}, {location.state}
              </h3>
              <p className={`font-semibold mb-2 ${count >= 3 ? 'text-red-600' : 'text-blue-600'}`}>
                {count} {count === 1 ? 'Report' : 'Reports'}
              </p>
              <div className="text-sm space-y-2">
                <p className="font-semibold">Types of Incidents:</p>
                {Object.entries(
                  reports.reduce((acc, r) => {
                    acc[r.bullyingType] = (acc[r.bullyingType] || 0) + 1;
                    return acc;
                  }, {} as Record<string, number>)
                ).map(([type, count]) => (
                  <div key={type} className="flex justify-between">
                    <span>{type}:</span>
                    <span>{count}</span>
                  </div>
                ))}
              </div>
              {count >= 3 && (
                <div className="mt-4">
                  <div className="text-red-600 font-semibold mb-2">
                    ⚠️ Critical Area Alert
                  </div>
                  <button
                    onClick={() => reports.forEach(report => onReportToCybercrime(report))}
                    className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Report to Cybercrime
                  </button>
                </div>
              )}
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
};

export default AdminMap;