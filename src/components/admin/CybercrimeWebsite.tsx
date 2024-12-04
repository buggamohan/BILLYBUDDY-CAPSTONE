import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { Report } from '../../types';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { Shield, AlertTriangle, Map, FileText } from 'lucide-react';
import { MAP_CONFIG } from '../../config/mapConfig';
import 'leaflet/dist/leaflet.css';

const CybercrimeWebsite: React.FC = () => {
  const { reports } = useData();
  const [criticalAreas, setCriticalAreas] = useState<any[]>([]);

  useEffect(() => {
    // Group reports by location and type
    const locationMap = {};
    reports.forEach(report => {
      const key = `${report.location.city}-${report.bullyingType}`;
      if (!locationMap[key]) {
        locationMap[key] = {
          location: report.location,
          type: report.bullyingType,
          reports: [],
          count: 0
        };
      }
      locationMap[key].reports.push(report);
      locationMap[key].count++;
    });

    // Filter areas with more than 3 reports
    const critical = Object.values(locationMap)
      .filter((area: any) => area.count >= 3)
      .map((area: any) => ({
        ...area,
        severity: area.count >= 10 ? 'critical' : area.count >= 5 ? 'high' : 'medium'
      }));

    setCriticalAreas(critical);
  }, [reports]);

  const getMarkerColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#DC2626';
      case 'high': return '#EA580C';
      default: return '#2563EB';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="text-red-600" size={32} />
          <h1 className="text-2xl font-bold">Cybercrime Reporting System</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-600 font-semibold">Critical Areas</p>
                <h3 className="text-2xl font-bold text-red-700">
                  {criticalAreas.filter(a => a.severity === 'critical').length}
                </h3>
              </div>
              <AlertTriangle className="text-red-500" size={32} />
            </div>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 font-semibold">High Risk Areas</p>
                <h3 className="text-2xl font-bold text-orange-700">
                  {criticalAreas.filter(a => a.severity === 'high').length}
                </h3>
              </div>
              <Map className="text-orange-500" size={32} />
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 font-semibold">Total Reports</p>
                <h3 className="text-2xl font-bold text-blue-700">{reports.length}</h3>
              </div>
              <FileText className="text-blue-500" size={32} />
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-lg overflow-hidden border">
            <div className="p-4 bg-gray-50 border-b">
              <h2 className="text-lg font-semibold">Cyberbullying Hotspots Map</h2>
            </div>
            <div className="h-[500px]">
              <MapContainer
                center={[MAP_CONFIG.center[0], MAP_CONFIG.center[1]]}
                zoom={MAP_CONFIG.zoom}
                className="h-full w-full"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                {criticalAreas.map((area, index) => (
                  <CircleMarker
                    key={index}
                    center={[area.location.lat, area.location.lng]}
                    radius={Math.min(area.count * 3, 20)}
                    fillColor={getMarkerColor(area.severity)}
                    color={getMarkerColor(area.severity)}
                    weight={2}
                    opacity={0.8}
                    fillOpacity={0.4}
                  >
                    <Popup>
                      <div className="p-3">
                        <h3 className="font-bold text-lg mb-2">
                          {area.location.city}, {area.location.state}
                        </h3>
                        <p className="text-red-600 font-semibold mb-2">
                          {area.count} Reports of {area.type}
                        </p>
                        <p className="text-sm text-gray-600">
                          Severity Level: <span className="font-semibold capitalize">{area.severity}</span>
                        </p>
                      </div>
                    </Popup>
                  </CircleMarker>
                ))}
              </MapContainer>
            </div>
          </div>

          <div className="bg-white rounded-lg overflow-hidden border">
            <div className="p-4 bg-gray-50 border-b">
              <h2 className="text-lg font-semibold">Critical Areas Report</h2>
            </div>
            <div className="divide-y">
              {criticalAreas.map((area, index) => (
                <div key={index} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">
                      {area.location.city}, {area.location.state}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      area.severity === 'critical' ? 'bg-red-100 text-red-800' :
                      area.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {area.severity.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2">
                    {area.count} reports of {area.type}
                  </p>
                  <div className="text-sm text-gray-500">
                    Last reported: {new Date(area.reports[area.reports.length - 1].timestamp).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CybercrimeWebsite;