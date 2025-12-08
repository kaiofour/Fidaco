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

const pokemonData = [
  { name: "Charizard", image: require("../../assets/icons/charizard.png") },
  { name: "Blastoise", image: require("../../assets/icons/Blastoise.png") },
  { name: "Beedrill", image: require("../../assets/icons/beedrill.jpg") },
  { name: "Butterfree", image: require("../../assets/icons/Butterfree.png") },
];

const HomeScreen = () => {
  const [selectedTab, setSelectedTab] = useState("All");

  return (
    <View style={styles.container}>
      {/* Scrollable Main Content */}
      <ScrollView showsVerticalScrollIndicator={false}>
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

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {["All", "Men", "Women"].map((tab) => (
            <TouchableOpacity key={tab} onPress={() => setSelectedTab(tab)}>
              <Text
                style={[
                  styles.tabText,
                  selectedTab === tab && styles.activeTab,
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

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        {[
          "Hunt",
          "Pokedex",
          "AR",
          "Feed",
          "Profile"
        ].map((label, index) => (
          <TouchableOpacity key={index} style={styles.navItem}>
            <Icon name="circle" size={22} />
            <Text style={styles.navLabel}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  searchWrapper: {
    padding: 15,
    paddingTop: 20,
    backgroundColor: "#fff",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    paddingHorizontal: 15,
    height: 45,
    borderRadius: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    marginTop: 10,
  },

  mysteryCard: {
    width: "48%",
    height: 130,
    backgroundColor: "#fff",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },
  questionMark: {
    fontSize: 48,
    color: "#000",
    fontWeight: "bold",
  },

  tabsContainer: {
    flexDirection: "row",
    gap: 20,
    paddingHorizontal: 15,
    marginTop: 20,
  },
  tabText: {
    fontSize: 15,
    color: "#666",
  },
  activeTab: {
    color: "#000",
    borderBottomWidth: 2,
    borderBottomColor: "#000",
    paddingBottom: 3,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    marginTop: 20,
  },

  card: {
    width: "48%",
    borderRadius: 12,
    backgroundColor: "#F7F7F7",
    padding: 10,
    marginBottom: 15,
    elevation: 2,
  },
  cardImage: {
    width: "100%",
    height: 110,
    resizeMode: "contain",
  },
  cardName: {
    marginTop: 10,
    fontWeight: "600",
    fontSize: 15,
  },

  scrollHint: {
    textAlign: "center",
    marginVertical: 20,
    color: "#888",
    fontSize: 14,
  },

  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#fff",
  },
  navItem: {
    alignItems: "center",
  },
  navLabel: {
    fontSize: 12,
    marginTop: 3,
  },
});
