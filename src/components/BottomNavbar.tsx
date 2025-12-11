import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Feather";

// Define the types for our props so TypeScript is happy
interface BottomNavbarProps {
  activeTab: string;
  onTabPress: (tabName: string) => void;
}

const tabs = [
  { name: "Hunt", icon: "crosshair" },
  { name: "Pokedex", icon: "grid" },
  { name: "AR", icon: "camera" }, // "AR" isn't a Feather icon, using camera as placeholder
  { name: "Feed", icon: "list" },
  { name: "Profile", icon: "user" },
];

const BottomNavbar = ({ activeTab, onTabPress }: BottomNavbarProps) => {
  return (
    <View style={styles.bottomNav}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.name;
        
        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.navItem}
            onPress={() => onTabPress(tab.name)}
          >
            <Icon
              name={tab.icon} // I updated "circle" to dynamic icons
              size={24}
              color={isActive ? "#FF5733" : "#888"} // Orange if active, Gray if not
            />
            <Text style={[styles.navLabel, isActive && styles.activeLabel]}>
              {tab.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    // Elevation for Android
    elevation: 10,
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  navLabel: {
    fontSize: 10,
    marginTop: 4,
    color: "#888",
    fontWeight: "500",
  },
  activeLabel: {
    color: "#FF5733",
    fontWeight: "bold",
  },
});

export default BottomNavbar;