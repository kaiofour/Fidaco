import React, { useState, useEffect } from 'react';
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
import Icon from 'react-native-vector-icons/Feather';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const ProfileScreen = ({ navigation }: any) => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    username: "Trainer",
    email: "",
    pokedexCount: 0,
    joinDate: "",
  });

  // 1. Fetch User Data when screen loads
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth().currentUser;
        
        if (currentUser) {
          // Get the document from 'users' collection with the ID matching the user's UID
          const userDoc = await firestore()
            .collection('users')
            .doc(currentUser.uid)
            .get();

          if (userDoc.exists) {
            // @ts-ignore
            setUserData(userDoc.data());
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // 2. Handle Logout
  const handleLogout = async () => {
    try {
      await auth().signOut();
      // Reset navigation stack so user cannot go "back" to the profile
      navigation.reset({
        index: 0,
        routes: [{ name: 'SignIn' }],
      });
    } catch (error) {
      Alert.alert("Error", "Failed to log out");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF5733" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          {/* Static Avatar for now - could be dynamic later */}
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

      {/* Stats Card */}
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

      {/* Menu Options */}
      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem}>
          <Icon name="settings" size={22} color="#555" />
          <Text style={styles.menuText}>Settings</Text>
          <Icon name="chevron-right" size={22} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Icon name="share-2" size={22} color="#555" />
          <Text style={styles.menuText}>Share Profile</Text>
          <Icon name="chevron-right" size={22} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Icon name="help-circle" size={22} color="#555" />
          <Text style={styles.menuText}>Help & Support</Text>
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
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0f0f0',
    borderWidth: 3,
    borderColor: '#FF5733',
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FF5733',
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#fff',
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  email: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
  joinDate: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 5,
    fontStyle: 'italic',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: -20, // This creates the overlap effect
    borderRadius: 15,
    paddingVertical: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  statBox: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
  },
  divider: {
    height: '60%',
    width: 1,
    backgroundColor: '#eee',
  },
  menuContainer: {
    marginTop: 30,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
  },
  menuText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  logoutButton: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#FFEEEA',
    backgroundColor: '#FFF5F2',
  },
  logoutText: {
    color: '#FF5733',
    fontWeight: 'bold',
  },
});

export default ProfileScreen;