export function distance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3;
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2-lat1) * Math.PI / 180;
  const Δλ = (lon2-lon1) * Math.PI / 180;
  const a = Math.sin(Δφ/2)**2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

// Random nearby spawn (approx 50–150m)
export function generateNearbySpawn(lat: number, lon: number) {
  const R = 0.001;
  return {
    lat: lat + (Math.random() - 0.5) * R,
    lon: lon + (Math.random() - 0.5) * R
  };
}
