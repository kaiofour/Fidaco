export function getBiome(lat: number, lon: number): "urban" | "rural" | "water" {
  // SUPER SIMPLE biome logic:
  // You can make this more advanced later.

  if (lat % 2 === 0) return "urban";
  if (lat % 3 === 0) return "water";
  return "rural";
}
