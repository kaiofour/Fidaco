import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";

// Import your new component
// Adjust the path based on where you created the file
import BottomNavbar from "../components/BottomNavbar"; 

const pokemonData = [
  { name: "Charizard", image: require("../../assets/icons/charizard.png") },
  { name: "Blastoise", image: require("../../assets/icons/Blastoise.png") },
  { name: "Beedrill", image: require("../../assets/icons/beedrill.jpg") },
  { name: "Butterfree", image: require("../../assets/icons/Butterfree.png") },
];

const HomeScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  // This function handles the actual navigation logic
  const handleNavigation = (tabName: string) => {
    console.log(`Navigating to ${tabName}...`);
    // Later, you will add real navigation code here (e.g., navigation.navigate(tabName))
  };

  return (
    <View style={styles.container}>
      {/* Scrollable Main Content */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Search Bar */}
        <View style={styles.searchWrapper}>
          <View style={styles.searchContainer}>
            <TextInput
              placeholder="Enter name or category"
              placeholderTextColor="#888"
              style={styles.searchInput}
            />
            <Icon name="search" size={20} color="#888" />
          </View>
        </View>

        {/* Two Cards */}
        <View style={styles.row}>
          <View style={styles.mysteryCard}>
            <Text style={styles.questionMark}>?</Text>
          </View>
          <View style={styles.mysteryCard}>
            <Text style={styles.questionMark}>?</Text>
          </View>
        </View>

        {/* Tabs (Categories) */}
        <View style={styles.tabsContainer}>
          {["All", "Men", "Women"].map((tab) => (
            <TouchableOpacity key={tab} onPress={() => setSelectedCategory(tab)}>
              <Text
                style={[
                  styles.tabText,
                  selectedCategory === tab && styles.activeTab,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Pokémon Grid */}
        <View style={styles.grid}>
          {pokemonData.map((item, index) => (
            <View key={index} style={styles.card}>
              <Image source={item.image} style={styles.cardImage} />
              <Text style={styles.cardName}>{item.name}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.scrollHint}>Scroll Down 👇</Text>
      </ScrollView>

      {/* NEW: Reusable Bottom Navbar Component */}
      {/* We assume HomeScreen corresponds to the "Pokedex" tab or maybe "Feed" */}
      <BottomNavbar 
        activeTab="Feed" 
        onTabPress={handleNavigation} 
      />
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA", // Added a light background
    paddingTop: 50, // Safe area padding
  },
  scrollContent: {
    paddingBottom: 20, // Space for scrolling
  },
  searchWrapper: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginRight: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  mysteryCard: {
    width: "48%",
    height: 100,
    backgroundColor: "#FFCC00",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  questionMark: {
    fontSize: 40,
    color: "#fff",
    fontWeight: "bold",
  },
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tabText: {
    fontSize: 16,
    color: "#888",
    marginRight: 20,
    fontWeight: "600",
  },
  activeTab: {
    color: "#000",
    borderBottomWidth: 2,
    borderBottomColor: "#000",
    paddingBottom: 2,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  card: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    marginBottom: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  cardImage: {
    width: 80,
    height: 80,
    marginBottom: 10,
    resizeMode: "contain",
  },
  cardName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  scrollHint: {
    textAlign: "center",
    color: "#aaa",
    marginTop: 10,
    marginBottom: 20,
  },
  // NOTE: I removed the old bottomNav styles here because they are now in the component
});

export default HomeScreen;