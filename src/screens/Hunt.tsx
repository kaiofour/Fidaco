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
  Vibration,
} from "react-native";
import MapView, {
  Marker,
  Region,
  UserLocationChangeEvent,
  PROVIDER_GOOGLE
} from "react-native-maps";
import Icon from 'react-native-vector-icons/Feather';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

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
  latitudeDelta: 0.005, 
  longitudeDelta: 0.005,
};

function getBiomeFromCoords(lat: number, lon: number): Biome {
  if (Math.abs(lat % 0.002) < 0.0005) return "water";
  if (Math.floor(Math.abs(lon * 100)) % 2 === 0) return "urban";
  return "rural";
}

function getRandomNearbyOffset() {
  const maxOffset = 0.0015; // ~150m radius
  const minOffset = 0.0002;
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
  
  // New State for Catching
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonSpawn | null>(null);
  const [catching, setCatching] = useState(false);
  
  const hasCenteredOnce = useRef(false);
  const mapRef = useRef<MapView>(null);

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
        setHasLocationPermission(granted === PermissionsAndroid.RESULTS.GRANTED);
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
      setRegion({ ...region, latitude: current.latitude, longitude: current.longitude });
    }
  };

  const handleCenterOnUser = () => {
    if (userLocation) {
      // @ts-ignore
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

    const newSpawns: PokemonSpawn[] = [];
    for (let i = 0; i < 3; i++) {
      newSpawns.push(spawnRandomPokemon(baseLat, baseLon));
    }
    setSpawns((prev) => [...prev, ...newSpawns]);
    
    // Clear selection when rescanning
    setSelectedPokemon(null);
    try { Vibration.vibrate(100); } catch(e){} // Safe vibrate
  };

  // 4. Catch Logic (FIXED SILENT FAILURE)
  const handleCatchPokemon = async () => {
    if (!selectedPokemon) return;

    // FIX: Fallback to region center if userLocation is null
    const currentLat = userLocation?.latitude ?? region.latitude;
    const currentLon = userLocation?.longitude ?? region.longitude;

    const dist = distanceInMeters(
      currentLat, currentLon,
      selectedPokemon.latitude, selectedPokemon.longitude
    );

    if (dist > 200) {
      Alert.alert("Too Far!", `Get closer! It is ${Math.round(dist)}m away.`);
      return;
    }

    setCatching(true);
    
    try {
      const currentUser = auth().currentUser;
      if (!currentUser) {
        Alert.alert("Error", "You must be logged in to catch Pokémon.");
        return;
      }

      // --- 1. NEW: Fetch Username for the Feed ---
      // We need to fetch the user profile first to get the name
      const userDoc = await firestore().collection('users').doc(currentUser.uid).get();
      const username = userDoc.data()?.username || "Trainer";

      // --- 2. NEW: Use Batch Write (Safety) ---
      const batch = firestore().batch();

      // A. Add to Private Collection (My Pokemon)
      const myPokemonRef = firestore()
        .collection('users')
        .doc(currentUser.uid)
        .collection('myPokemon')
        .doc(); // Auto-generate ID
      
      batch.set(myPokemonRef, {
        name: selectedPokemon.name,
        caughtAt: firestore.FieldValue.serverTimestamp(),
        biome: selectedPokemon.biome
      });

      // B. Update User Stats (Increment Count)
      const userRef = firestore().collection('users').doc(currentUser.uid);
      batch.update(userRef, {
        pokedexCount: firestore.FieldValue.increment(1)
      });

      // C. NEW: Add to Public Feed
      const feedRef = firestore().collection('feed').doc();
      batch.set(feedRef, {
        username: username,
        pokemonName: selectedPokemon.name,
        timestamp: firestore.FieldValue.serverTimestamp(),
        biome: selectedPokemon.biome,
        userId: currentUser.uid // Useful if you want to make the name clickable later
      });

      // Commit all 3 writes at once
      await batch.commit();

      // --- Success UI (Same as before) ---
      Alert.alert("Gotcha!", `You caught a ${selectedPokemon.name}!`);
      try { Vibration.vibrate([0, 500, 200, 500]); } catch(e){} 

      // Remove from map
      setSpawns((prev) => prev.filter(p => p.id !== selectedPokemon.id));
      setSelectedPokemon(null);

    } catch (error) {
      console.error(error);
      Alert.alert("Oh no!", "The Pokémon broke free! (Network Error)");
    } finally {
      setCatching(false);
    }
  };

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
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={DEFAULT_REGION}
        showsUserLocation={hasLocationPermission}
        showsMyLocationButton={false}
        onUserLocationChange={handleUserLocationChange}
        onPress={() => setSelectedPokemon(null)}
      >
        {spawns.map((pkm) => (
          <Marker
            key={pkm.id}
            coordinate={{ latitude: pkm.latitude, longitude: pkm.longitude }}
            title={pkm.name}
            onPress={(e) => {
              e.stopPropagation();
              setSelectedPokemon(pkm);
            }}
            pinColor={
              selectedPokemon?.id === pkm.id ? 'red' :
              pkm.biome === 'water' ? 'blue' : 
              pkm.biome === 'urban' ? 'purple' : 'green'
            }
          />
        ))}
      </MapView>

      <View style={styles.overlayContainer}>
        <View style={styles.infoCard}>
          {selectedPokemon ? (
            <>
              <Text style={styles.title}>Target: {selectedPokemon.name}</Text>
              <Text style={styles.subtitle}>Biome: {selectedPokemon.biome}</Text>
              <Text style={styles.distanceText}>
                 {/* Display distance relative to map center if GPS missing */}
                 Distance: {Math.round(distanceInMeters(
                   userLocation?.latitude ?? region.latitude, 
                   userLocation?.longitude ?? region.longitude, 
                   selectedPokemon.latitude, 
                   selectedPokemon.longitude
                 ))}m
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.title}>📍 Hunt Mode</Text>
              <Text style={styles.subtitle}>{spawns.length} Pokémon visible</Text>
            </>
          )}
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={[styles.circleButton, styles.whiteBtn]} onPress={handleCenterOnUser}>
            <Icon name="navigation" size={24} color="#CC0000" />
          </TouchableOpacity>

          {selectedPokemon ? (
            <TouchableOpacity 
              style={[styles.pillButton, styles.greenBtn]} 
              onPress={handleCatchPokemon}
              disabled={catching}
            >
              {catching ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Icon name="disc" size={20} color="#fff" style={{ marginRight: 8 }} />
                  <Text style={styles.btnText}>CATCH IT!</Text>
                </>
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={[styles.pillButton, styles.redBtn]} onPress={handleScanForPokemon}>
              <Icon name="radio" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.btnText}>SCAN AREA</Text>
            </TouchableOpacity>
          )}
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
  overlayContainer: { position: "absolute", bottom: 30, left: 20, right: 20 },
  infoCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    elevation: 4,
    alignItems: 'center'
  },
  title: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  subtitle: { fontSize: 12, color: '#666', marginTop: 4 },
  distanceText: { fontSize: 12, color: '#CC0000', fontWeight: 'bold', marginTop: 4 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  circleButton: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', elevation: 5 },
  pillButton: { flex: 1, height: 50, marginLeft: 15, borderRadius: 25, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', elevation: 5 },
  whiteBtn: { backgroundColor: 'white' },
  redBtn: { backgroundColor: '#CC0000' },
  greenBtn: { backgroundColor: '#28a745' },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});