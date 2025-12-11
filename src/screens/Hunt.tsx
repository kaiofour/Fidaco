import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  Dimensions,
} from "react-native";
import MapView, {
  Marker,
  Region,
  UserLocationChangeEvent,
  PROVIDER_GOOGLE
} from "react-native-maps";
import Icon from 'react-native-vector-icons/Feather'; // Assuming you use vector icons

// --- Types ---
type Biome = "urban" | "rural" | "water";

type PokemonSpawn = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  biome: Biome;
};

type SimpleCoord = {
  latitude: number;
  longitude: number;
};

// --- Game Logic ---
const BIOME_POKEMON: Record<Biome, string[]> = {
  urban: ["Pikachu", "Magnemite", "Grimer", "Koffing", "Eevee", "Meowth"],
  rural: ["Bulbasaur", "Pidgey", "Rattata", "Oddish", "Caterpie", "Weedle"],
  water: ["Squirtle", "Magikarp", "Psyduck", "Tentacool", "Slowpoke", "Poliwag"],
};

// USC Talamban Campus (TC)
const DEFAULT_REGION: Region = {
  latitude: 10.3521,
  longitude: 123.9125,
  latitudeDelta: 0.01, // Zoom level (smaller number = closer zoom)
  longitudeDelta: 0.01,
};

function getBiomeFromCoords(lat: number, lon: number): Biome {
  // Simple simulation logic
  if (Math.abs(lat % 0.002) < 0.0005) return "water";
  if (Math.floor(Math.abs(lon * 100)) % 2 === 0) return "urban";
  return "rural";
}

function getRandomNearbyOffset() {
  const maxOffset = 0.002; // Roughly 200m
  const minOffset = 0.0005;
  const offsetLat = (Math.random() * (maxOffset - minOffset) + minOffset) * (Math.random() > 0.5 ? 1 : -1);
  const offsetLon = (Math.random() * (maxOffset - minOffset) + minOffset) * (Math.random() > 0.5 ? 1 : -1);
  return { offsetLat, offsetLon };
}

function spawnRandomPokemon(lat: number, lon: number): PokemonSpawn {
  const biome = getBiomeFromCoords(lat, lon);
  const list = BIOME_POKEMON[biome];
  const name = list[Math.floor(Math.random() * list.length)];
  const { offsetLat, offsetLon } = getRandomNearbyOffset();

  return {
    id: Date.now() + Math.floor(Math.random() * 10000),
    name,
    biome,
    latitude: lat + offsetLat,
    longitude: lon + offsetLon,
  };
}

function distanceInMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000;
  const toRad = (v: number) => (v * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// --- Component ---
const HuntScreen: React.FC = () => {
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<SimpleCoord | null>(null);
  const [region, setRegion] = useState<Region>(DEFAULT_REGION);
  const [spawns, setSpawns] = useState<PokemonSpawn[]>([]);
  const hasCenteredOnce = useRef(false);

  // 1. Request Permission
  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === "android") {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Permission",
            message: "PokeExplorer needs your location to find nearby Pokémon!",
            buttonPositive: "OK",
          }
        );
        const ok = granted === PermissionsAndroid.RESULTS.GRANTED;
        setHasLocationPermission(ok);
      } else {
        setHasLocationPermission(true);
      }
    } catch (err) {
      console.warn("Permission error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    requestLocationPermission();
  }, []);

  // 2. Handle Map Location Updates
  const handleUserLocationChange = (event: UserLocationChangeEvent) => {
    const coord = event.nativeEvent.coordinate;
    if (!coord) return;

    const current = { latitude: coord.latitude, longitude: coord.longitude };
    setUserLocation(current);

    if (!hasCenteredOnce.current) {
      hasCenteredOnce.current = true;
      setRegion({
        ...region,
        latitude: current.latitude,
        longitude: current.longitude,
      });
    }
  };

  const handleCenterOnUser = () => {
    if (userLocation) {
      // @ts-ignore - mapRef typing can be tricky
      mapRef.current?.animateToRegion({
        ...region,
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
      }, 1000);
    } else {
      Alert.alert("Waiting for GPS", "We haven't found you yet!");
    }
  };

  // 3. Scan Logic
  const handleScanForPokemon = () => {
    const baseLat = userLocation?.latitude ?? region.latitude;
    const baseLon = userLocation?.longitude ?? region.longitude;

    // Generate 3 random spawns near the center
    const newSpawns: PokemonSpawn[] = [];
    for (let i = 0; i < 3; i++) {
      newSpawns.push(spawnRandomPokemon(baseLat, baseLon));
    }

    setSpawns((prev) => [...prev, ...newSpawns]);

    // Check if any are super close (capture range)
    const nearby = newSpawns.filter((pkm) => {
      const dist = distanceInMeters(baseLat, baseLon, pkm.latitude, pkm.longitude);
      return dist < 50; // 50 meters
    });

    if (nearby.length > 0) {
      Alert.alert(
        "Wild Pokémon Nearby!",
        `You found a ${nearby[0].name} (${nearby[0].biome})! Get closer to catch it!`
      );
    } else {
      Alert.alert("Scanner Result", "3 Pokémon detected nearby. Check your map!");
    }
  };

  const mapRef = useRef<MapView>(null);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#CC0000" />
        <Text style={styles.textDark}>Initializing GPS...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE} // Forces Google Maps
        style={styles.map}
        initialRegion={DEFAULT_REGION}
        showsUserLocation={hasLocationPermission}
        showsMyLocationButton={false} // We made a custom one
        onUserLocationChange={handleUserLocationChange}
      >
        {spawns.map((pkm) => (
          <Marker
            key={pkm.id}
            coordinate={{ latitude: pkm.latitude, longitude: pkm.longitude }}
            title={pkm.name}
            description={`Type: ${pkm.biome}`}
            pinColor={pkm.biome === 'water' ? 'blue' : pkm.biome === 'urban' ? 'purple' : 'green'}
          />
        ))}
      </MapView>

      {/* UI Overlay */}
      <View style={styles.overlayContainer}>
        <View style={styles.infoCard}>
          <Text style={styles.title}>📍 Hunt Mode</Text>
          <Text style={styles.subtitle}>{spawns.length} Pokémon detected in area</Text>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={[styles.circleButton, styles.whiteBtn]} onPress={handleCenterOnUser}>
            <Icon name="navigation" size={24} color="#CC0000" />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.pillButton, styles.redBtn]} onPress={handleScanForPokemon}>
            <Icon name="radio" size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.btnText}>SCAN AREA</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default HuntScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  textDark: { marginTop: 10, color: '#333' },
  
  overlayContainer: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
  },
  infoCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    alignItems: 'center'
  },
  title: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  subtitle: { fontSize: 12, color: '#666', marginTop: 4 },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  circleButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  pillButton: {
    flex: 1,
    height: 50,
    marginLeft: 15,
    borderRadius: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  whiteBtn: { backgroundColor: 'white' },
  redBtn: { backgroundColor: '#CC0000' },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});