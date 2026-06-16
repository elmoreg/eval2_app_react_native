import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';

export function useImagePicker() {
  const [error, setError] = useState<string | null>(null);

  const takePhoto = async (): Promise<string | null> => {
    setError(null);
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      setError('Se necesita acceso a la cámara para tomar fotos.');
      return null;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        return result.assets[0].uri;
      }
      return null;
    } catch (err) {
      setError('Ocurrió un error al tomar la foto.');
      return null;
    }
  };

  const pickFromGallery = async (): Promise<string | null> => {
    setError(null);
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      setError('Se necesita acceso a la galería para seleccionar fotos.');
      return null;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        return result.assets[0].uri;
      }
      return null;
    } catch (err) {
      setError('Ocurrió un error al abrir la galería.');
      return null;
    }
  };

  return {
    takePhoto,
    pickFromGallery,
    error,
  };
}
