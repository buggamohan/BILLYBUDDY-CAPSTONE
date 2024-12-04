import axios from 'axios';

export interface GeocodingResult {
  lat: number;
  lng: number;
  address: string;
  state: string;
  district: string;
  city: string;
}

export async function geocodeLocation(city: string, district: string, state: string): Promise<GeocodingResult> {
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        `${city}, ${district}, ${state}, India`
      )}&limit=1&countrycodes=in`
    );

    if (response.data && response.data[0]) {
      const result = response.data[0];
      return {
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon),
        address: result.display_name,
        state,
        district,
        city
      };
    }
    throw new Error('Location not found');
  } catch (error) {
    console.error('Geocoding error:', error);
    // Fallback to approximate coordinates within India
    return {
      lat: 20.5937 + (Math.random() * 10 - 5),
      lng: 78.9629 + (Math.random() * 10 - 5),
      address: `${city}, ${district}, ${state}`,
      state,
      district,
      city
    };
  }
}