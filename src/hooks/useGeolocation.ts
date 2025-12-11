import { useEffect, useState } from "react";
import Geolocation from "react-native-geolocation-service";

export function useGeolocation() {
  const [location, setLocation] = useState<{lat: number; lon: number} | null>(null);

  useEffect(() => {
    Geolocation.getCurrentPosition(
      pos => {
        setLocation({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        });
      },
      error => console.log(error),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }, []);

  return location;
}
