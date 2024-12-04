import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import { Report } from '../../types';
import { divIcon } from 'leaflet';

interface MapMarkerProps {
  report: Report;
  isSelected: boolean;
  onClick: () => void;
}

const MapMarker: React.FC<MapMarkerProps> = ({ report, isSelected, onClick }) => {
  const markerIcon = divIcon({
    className: 'custom-marker',
    html: `<div class="w-6 h-6 rounded-full ${isSelected ? 'bg-red-500' : 'bg-blue-500'} flex items-center justify-center text-white text-xs font-bold">!</div>`,
  });

  return (
    <Marker
      position={[report.location.lat, report.location.lng]}
      icon={markerIcon}
      eventHandlers={{
        click: onClick
      }}
    >
      {isSelected && (
        <Popup>
          <div className="p-2">
            <h3 className="font-bold text-sm">{report.bullyingType}</h3>
            <p className="text-xs text-gray-600">
              {report.location.city}, {report.location.district}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Severity: <span className="capitalize">{report.severity}</span>
            </p>
          </div>
        </Popup>
      )}
    </Marker>
  );
};

export default MapMarker;