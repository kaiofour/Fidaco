import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator,
  Alert 
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

// Define the shape of a caught Pokemon
type CaughtPokemon = {
  id: string;
  name: string;
  biome: string;
  caughtAt: any;
};

const ProfileScreen = ({ navigation }: any) => {
  // --- 1. ALL HOOKS MUST BE AT THE TOP ---
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    username: "Trainer",
    email: "",
    pokedexCount: 0,
    joinDate: "",
  });
  const [caughtPokemon, setCaughtPokemon] = useState<CaughtPokemon[]>([]);

  // This hook runs every time you look at the profile screen
  useFocusEffect(
    useCallback(() => {
      const fetchUserData = async () => {
        try {
          const currentUser = auth().currentUser;
          if (currentUser) {
            // A. Get User Stats
            const userDoc = await firestore()
              .collection('users')
              .doc(currentUser.uid)
              .get();

            if (userDoc.exists) {
              // @ts-ignore
              setUserData(userDoc.data());
            }

            // B. Get Recent Catches
            const pokemonSnapshot = await firestore()
              .collection('users')
              .doc(currentUser.uid)
              .collection('myPokemon')
              .orderBy('caughtAt', 'desc')
              .limit(10) // Limit to 10 for performance
              .get();

            const pokemonList = pokemonSnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            })) as CaughtPokemon[];

            setCaughtPokemon(pokemonList);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchUserData();
    }, [])
  );

  // --- 2. HELPER FUNCTIONS ---
  const handleLogout = async () => {
    try {
      await auth().signOut();
      // FIX: Reset to 'Auth' stack, NOT 'SignIn' screen
      navigation.reset({
        index: 0,
        routes: [{ name: 'Auth' }], 
      });
    } catch (error) {
      Alert.alert("Error", "Failed to log out");
    }
  };

  // --- 3. LOADING CHECK (MUST BE AFTER HOOKS) ---
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#CC0000" />
      </View>
    );
  }

  // --- 4. MAIN RENDER ---
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Image 
            source={{ uri: "https://img.pokemondb.net/sprites/home/normal/pikachu.png" }} 
            style={styles.avatar} 
          />
          <TouchableOpacity style={styles.editIcon}>
            <Icon name="edit-2" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text style={styles.username}>{userData.username}</Text>
        <Text style={styles.email}>{userData.email}</Text>
        <Text style={styles.joinDate}>Joined: {userData.joinDate}</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{userData.pokedexCount}</Text>
          <Text style={styles.statLabel}>Pokémon</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>1</Text>
          <Text style={styles.statLabel}>Rank</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Badges</Text>
        </View>
      </View>

      {/* Recent Catches */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Recent Catches</Text>
        {caughtPokemon.length === 0 ? (
          <Text style={styles.emptyText}>No Pokémon caught yet. Go Hunt!</Text>
        ) : (
          <View style={styles.pokemonGrid}>
            {caughtPokemon.map((pkm) => (
              <View key={pkm.id} style={styles.pokemonCard}>
                <View style={[styles.badge, { 
                  backgroundColor: pkm.biome === 'water' ? '#E3F2FD' : pkm.biome === 'urban' ? '#F3E5F5' : '#E8F5E9' 
                }]}>
                  <Text style={[styles.badgeText, {
                     color: pkm.biome === 'water' ? '#1E88E5' : pkm.biome === 'urban' ? '#8E24AA' : '#2E7D32'
                  }]}>{pkm.biome}</Text>
                </View>
                <Text style={styles.pokemonName}>{pkm.name}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Menu */}
      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem}>
          <Icon name="settings" size={22} color="#555" />
          <Text style={styles.menuText}>Settings</Text>
          <Icon name="chevron-right" size={22} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.menuItem, styles.logoutButton]} onPress={handleLogout}>
          <Icon name="log-out" size={22} color="#FF5733" />
          <Text style={[styles.menuText, styles.logoutText]}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    backgroundColor: '#fff', alignItems: 'center', paddingVertical: 30,
    borderBottomLeftRadius: 30, borderBottomRightRadius: 30, elevation: 5,
  },
  avatarContainer: { position: 'relative', marginBottom: 15 },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#f0f0f0', borderWidth: 3, borderColor: '#FF5733' },
  editIcon: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#FF5733', padding: 8, borderRadius: 20, borderWidth: 2, borderColor: '#fff' },
  username: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  email: { fontSize: 14, color: '#888', marginTop: 5 },
  joinDate: { fontSize: 12, color: '#aaa', marginTop: 5, fontStyle: 'italic' },
  statsContainer: {
    flexDirection: 'row', backgroundColor: '#fff', marginHorizontal: 20, marginTop: -20,
    borderRadius: 15, paddingVertical: 20, elevation: 3, justifyContent: 'space-evenly', alignItems: 'center',
  },
  statBox: { alignItems: 'center' },
  statNumber: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  statLabel: { fontSize: 12, color: '#888' },
  divider: { height: '60%', width: 1, backgroundColor: '#eee' },
  sectionContainer: { marginTop: 25, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 15 },
  emptyText: { fontStyle: 'italic', color: '#999' },
  pokemonGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  pokemonCard: {
    width: '48%', backgroundColor: 'white', borderRadius: 12, padding: 15,
    marginBottom: 15, elevation: 2, alignItems: 'center'
  },
  pokemonName: { fontSize: 16, fontWeight: 'bold', color: '#333', marginTop: 8 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  badgeText: { fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
  menuContainer: { marginTop: 10, paddingHorizontal: 20, paddingBottom: 20 },
  menuItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 10, elevation: 1 },
  menuText: { flex: 1, marginLeft: 15, fontSize: 16, color: '#333', fontWeight: '500' },
  logoutButton: { marginTop: 20, borderWidth: 1, borderColor: '#FFEEEA', backgroundColor: '#FFF5F2' },
  logoutText: { color: '#FF5733', fontWeight: 'bold' },
});

export default ProfileScreen;