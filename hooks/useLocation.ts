import { useState } from 'react';
import * as Location from 'expo-location';

interface Coordinates {
  latitude: number;
  longitude: number;
}

export function useLocation() {
  const [error, setError] = useState<string | null>(null);

  const getLocation = async (): Promise<Coordinates | null> => {
    setError(null);
    const { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      setError('Se necesita acceso a la ubicación para registrar las coordenadas.');
      return null;
    }

    try {
      const location = await Location.getCurrentPositionAsync({});
      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
    } catch (err) {
      setError('Ocurrió un error al obtener la ubicación actual.');
      return null;
    }
  };

  return {
    getLocation,
    error,
  };
}
