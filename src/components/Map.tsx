import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import { Report } from '../types';
import { MAP_CONFIG } from '../config/mapConfig';
import { storageService } from '../services/storageService';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

interface MapViewProps {
  reports: Report[];
}

const MapView: React.FC<MapViewProps> = ({ reports = [] }) => {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const getMarkerColor = (count: number) => {
    if (count >= 10) return '#FF0000';
    if (count >= 7) return '#FF4500';
    if (count >= 3) return '#FFA500';
    return '#2196F3';
  };

  // Group reports by location
  const locationGroups = (Array.isArray(reports) ? reports : []).reduce((acc, report) => {
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
      className="h-[400px] rounded-lg overflow-hidden shadow-lg"
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
            <div className="p-3">
              <h3 className="font-bold text-lg mb-2">
                {location.city || location.district}, {location.state}
              </h3>
              <p className="text-red-600 font-semibold mb-2">
                {count} {count === 1 ? 'Report' : 'Reports'}
              </p>
              <div className="text-sm">
                <p className="font-semibold mb-1">Types of Incidents:</p>
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
                <div className="mt-3 text-sm text-red-600">
                  ⚠️ Critical area - Reported to cybercrime authorities
                </div>
              )}
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
};

export default MapView;