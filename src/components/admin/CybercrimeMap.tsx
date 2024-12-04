import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { Report } from '../../types';
import { MAP_CONFIG } from '../../config/mapConfig';
import { useData } from '../../context/DataContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import 'leaflet/dist/leaflet.css';

const CybercrimeMap: React.FC = () => {
  const { reports } = useData();
  const [hotspots, setHotspots] = useState<any[]>([]);
  const [bullyingStats, setBullyingStats] = useState<any[]>([]);

  useEffect(() => {
    if (reports.length > 0) {
      // Calculate hotspots
      const locationMap = new Map();
      reports.forEach(report => {
        const key = `${report.location.lat},${report.location.lng}`;
        if (!locationMap.has(key)) {
          locationMap.set(key, {
            location: report.location,
            reports: [],
            count: 0
          });
        }
        const spot = locationMap.get(key);
        spot.reports.push(report);
        spot.count++;
      });

      setHotspots(Array.from(locationMap.values()));

      // Calculate bullying type statistics
      const stats = reports.reduce((acc: any, report) => {
        acc[report.bullyingType] = (acc[report.bullyingType] || 0) + 1;
        return acc;
      }, {});

      setBullyingStats(Object.entries(stats).map(([name, value]) => ({
        name,
        count: value
      })));
    }
  }, [reports]);

  const getMarkerColor = (count: number) => {
    if (count >= 10) return '#EF4444';
    if (count >= 5) return '#F59E0B';
    return '#3B82F6';
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Cybercrime Hotspots</h2>
        <div className="h-[500px] rounded-lg overflow-hidden">
          <MapContainer
            center={[MAP_CONFIG.center[0], MAP_CONFIG.center[1]]}
            zoom={MAP_CONFIG.zoom}
            className="h-full w-full"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            {hotspots.map((hotspot, index) => (
              <CircleMarker
                key={index}
                center={[hotspot.location.lat, hotspot.location.lng]}
                radius={Math.min(hotspot.count * 3, 20)}
                fillColor={getMarkerColor(hotspot.count)}
                color={getMarkerColor(hotspot.count)}
                weight={2}
                opacity={0.8}
                fillOpacity={0.4}
              >
                <Popup>
                  <div className="p-3">
                    <h3 className="font-bold text-lg mb-2">
                      {hotspot.location.city}, {hotspot.location.state}
                    </h3>
                    <p className="text-red-600 font-semibold mb-2">
                      {hotspot.count} Reports
                    </p>
                    <div className="text-sm">
                      <p className="font-semibold mb-1">Types of Incidents:</p>
                      {Object.entries(
                        hotspot.reports.reduce((acc: any, r: Report) => {
                          acc[r.bullyingType] = (acc[r.bullyingType] || 0) + 1;
                          return acc;
                        }, {})
                      ).map(([type, count]) => (
                        <div key={type} className="flex justify-between">
                          <span>{type}:</span>
                          <span>{count as number}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Cyberbullying Statistics</h2>
        <div className="h-[400px]">
          <BarChart width={800} height={400} data={bullyingStats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#4F46E5" name="Number of Reports" />
          </BarChart>
        </div>
      </div>
    </div>
  );
};

export default CybercrimeMap;