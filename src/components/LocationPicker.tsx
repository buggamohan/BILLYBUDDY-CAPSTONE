import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Search } from 'lucide-react';
import { MAP_CONFIG } from '../config/mapConfig';

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LocationPickerProps {
  onLocationSelect: (location: {
    lat: number;
    lng: number;
    address: string;
    state: string;
    district: string;
    city: string;
  }) => void;
}

// Component to handle map click events
const MapClickHandler: React.FC<{
  onMapClick: (e: L.LeafletMouseEvent) => void;
}> = ({ onMapClick }) => {
  const map = useMap();
  useEffect(() => {
    map.on('click', onMapClick);
    return () => {
      map.off('click', onMapClick);
    };
  }, [map, onMapClick]);
  return null;
};

const LocationPicker: React.FC<LocationPickerProps> = ({ onLocationSelect }) => {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [marker, setMarker] = useState<L.LatLng | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  const handleMapClick = async (e: L.LeafletMouseEvent) => {
    setLoading(true);
    const { lat, lng } = e.latlng;
    setMarker(e.latlng);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();

      if (data.address) {
        const location = {
          lat,
          lng,
          address: data.display_name,
          state: data.address.state || '',
          district: data.address.county || data.address.city_district || '',
          city: data.address.city || data.address.town || data.address.village || ''
        };
        onLocationSelect(location);
      }
    } catch (error) {
      console.error('Error getting location details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}, India&limit=1`
      );
      const data = await response.json();

      if (data[0]) {
        const { lat, lon } = data[0];
        const newLatLng = new L.LatLng(parseFloat(lat), parseFloat(lon));
        setMarker(newLatLng);
        mapRef.current?.flyTo(newLatLng, 12);
        
        // Trigger the reverse geocoding
        handleMapClick({
          latlng: newLatLng,
          target: mapRef.current as L.Map,
          type: 'click',
          originalEvent: new MouseEvent('click'),
          containerPoint: new L.Point(0, 0),
          layerPoint: new L.Point(0, 0)
        });
      }
    } catch (error) {
      console.error('Error searching location:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search location (e.g., Mumbai, Maharashtra)"
          className="w-full px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
      </form>

      <div className="relative">
        <MapContainer
          center={[MAP_CONFIG.center[0], MAP_CONFIG.center[1]]}
          zoom={MAP_CONFIG.zoom}
          className="h-[300px] rounded-lg overflow-hidden shadow-lg"
          whenCreated={(map) => { mapRef.current = map; }}
          maxBounds={[
            [MAP_CONFIG.bounds.south, MAP_CONFIG.bounds.west],
            [MAP_CONFIG.bounds.north, MAP_CONFIG.bounds.east]
          ]}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <MapClickHandler onMapClick={handleMapClick} />
          {marker && <Marker position={marker} />}
        </MapContainer>
        {loading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-white">Loading location details...</div>
          </div>
        )}
      </div>
      
      <p className="text-sm text-gray-600">
        Click on the map to select your location or use the search bar above
      </p>
    </div>
  );
};

export default LocationPicker;