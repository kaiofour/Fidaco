import { getBiome } from "./biome";

type BiomeType = "urban" | "rural" | "water";

const encounters: Record<BiomeType, string[]> = {
  urban: ["Pidgey", "Rattata", "Magnemite"],
  rural: ["Caterpie", "Weedle", "Oddish"],
  water: ["Magikarp", "Psyduck", "Poliwag"]
};

export function getRandomEncounter(lat: number, lon: number): string {
  const biome: BiomeType = getBiome(lat, lon);

  const list = encounters[biome];
  const random = Math.floor(Math.random() * list.length);

  return list[random];
}
