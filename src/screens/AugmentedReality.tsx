import React, { useEffect, useState, useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  Image, 
  Alert, 
  ActivityIndicator,
  Vibration 
} from 'react-native';
import { 
  Camera, 
  useCameraDevice, 
  useCameraPermission, 
  useCameraFormat 
} from 'react-native-vision-camera';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/Feather';

// Define params we expect from the Hunt Screen
type ARRouteParams = {
  params: {
    pokemonName?: string;
    biome?: string;
  }
};

const AugmentedReality = () => {
  const device = useCameraDevice('back');
  const { hasPermission, requestPermission } = useCameraPermission();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ARRouteParams, 'params'>>();
  
  // Get data passed from Hunt Screen (if any)
  const { pokemonName, biome } = route.params || {};

  const [catching, setCatching] = useState(false);

  // 1. Setup Camera Format (Prevents Android Crash)
  const format = useCameraFormat(device, [
    { photoResolution: 'max' }
  ]);

  useEffect(() => {
    if (!hasPermission) requestPermission();
  }, [hasPermission]);

  // 2. Helper to get Sprite URL
  const getSpriteUrl = (name: string) => {
    const cleanName = name.toLowerCase().replace('.', '').replace(' ', '-');
    return `https://img.pokemondb.net/sprites/home/normal/${cleanName}.png`;
  };

  // 3. Capture Logic (Firebase)
  const handleCapture = async () => {
    if (!pokemonName) {
      Alert.alert("No Target", "There is no Pokémon here to catch!");
      return;
    }

    setCatching(true);

    try {
      const currentUser = auth().currentUser;
      if (!currentUser) {
        Alert.alert("Error", "You must be logged in.");
        return;
      }

      // A. Get Username
      const userDoc = await firestore().collection('users').doc(currentUser.uid).get();
      const username = userDoc.data()?.username || "Trainer";

      // B. Batch Write (Profile + Feed)
      const batch = firestore().batch();

      // Profile Ref
      const myPokemonRef = firestore()
        .collection('users')
        .doc(currentUser.uid)
        .collection('myPokemon')
        .doc();
      
      batch.set(myPokemonRef, {
        name: pokemonName,
        caughtAt: firestore.FieldValue.serverTimestamp(),
        biome: biome || 'unknown'
      });

      // Stats Ref
      const userRef = firestore().collection('users').doc(currentUser.uid);
      batch.update(userRef, {
        pokedexCount: firestore.FieldValue.increment(1)
      });

      // Feed Ref
      const feedRef = firestore().collection('feed').doc();
      batch.set(feedRef, {
        username: username,
        pokemonName: pokemonName,
        timestamp: firestore.FieldValue.serverTimestamp(),
        biome: biome || 'unknown',
        userId: currentUser.uid
      });

      await batch.commit();

      // C. Success
      Vibration.vibrate([0, 100, 100, 100]); // Success pattern
      Alert.alert("GOTCHA!", `${pokemonName} was registered to your Pokedex!`, [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);

    } catch (error) {
      console.error(error);
      Alert.alert("Error", "The Pokémon escaped due to a network error.");
    } finally {
      setCatching(false);
    }
  };

  if (!device || !hasPermission) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#CC0000" />
        <Text style={{marginTop: 10, color: '#fff'}}>Requesting Camera...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        photo={true} // Enable photo mode logic
        format={format} // Crucial for Android stability
      />

      <View style={styles.overlay}>
        
        {/* Top UI */}
        <View style={styles.topBar}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>AR MODE</Text>
          </View>
        </View>

        {/* The Pokemon in the "Real World" */}
        <View style={styles.centerStage}>
          {pokemonName ? (
            <>
               <Text style={styles.wildText}>A wild {pokemonName.toUpperCase()} appeared!</Text>
               <Image 
                 source={{ uri: getSpriteUrl(pokemonName) }} 
                 style={styles.pokemonSprite} 
               />
            </>
          ) : (
            <Text style={styles.scanningText}>Scanning Area...</Text>
          )}
        </View>

        {/* Bottom Controls */}
        <View style={styles.controls}>
          <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
             <Text style={styles.btnText}>RUN AWAY</Text>
          </TouchableOpacity>

          {pokemonName && (
            <TouchableOpacity 
              style={[styles.captureBtn, catching && styles.disabledBtn]} 
              onPress={handleCapture}
              disabled={catching}
            >
              {catching ? (
                 <ActivityIndicator color="red" />
              ) : (
                 <View style={styles.captureInner} />
              )}
            </TouchableOpacity>
          )}
          
          {/* Spacer to center the button */}
          <View style={{width: 80}} /> 
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
  overlay: { flex: 1, justifyContent: 'space-between', paddingVertical: 50 },
  
  topBar: { alignItems: 'center', marginTop: 10 },
  badge: { backgroundColor: 'rgba(255, 0, 0, 0.7)', paddingHorizontal: 15, paddingVertical: 5, borderRadius: 5 },
  badgeText: { color: 'white', fontWeight: 'bold', letterSpacing: 2 },

  centerStage: { alignItems: 'center', justifyContent: 'center' },
  wildText: { color: 'white', fontSize: 24, fontWeight: 'bold', textShadowColor: 'black', textShadowRadius: 10, marginBottom: 20 },
  scanningText: { color: 'rgba(255,255,255,0.7)', fontSize: 18, fontStyle: 'italic' },
  pokemonSprite: { width: 250, height: 250, resizeMode: 'contain' },

  controls: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingBottom: 20 },
  
  captureBtn: { 
    width: 80, height: 80, borderRadius: 40, borderWidth: 5, borderColor: '#FFF', 
    justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)' 
  },
  captureInner: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#CC0000' },
  disabledBtn: { opacity: 0.7 },

  closeBtn: { padding: 15, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 30 },
  btnText: { color: '#FFF', fontWeight: 'bold' }
});

export default AugmentedReality;