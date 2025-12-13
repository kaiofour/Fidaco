import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Feather";

// --- BMO COLORS (Matching your other screens) ---
const COLORS = {
  BODY: "#639FAB",       // Teal Background
  BORDER: "#4A7A85",     // Darker Teal for edges
  ACTIVE: "#F4D35E",     // Yellow (D-Pad color)
  INACTIVE: "#2A454B",   // Dark Text color
  RED_BTN: "#FF595E",    // Big Red Button
  BTN_SHADOW: "rgba(0,0,0,0.2)"
};

const BottomNavbar = ({ state, descriptors, navigation }: BottomTabBarProps) => {

  const getIconName = (routeName: string) => {
    switch (routeName) {
      case "Hunt": return "crosshair";
      case "Pokedex": return "grid";
      case "AR": return "camera";
      case "Feed": return "list";
      case "Profile": return "user";
      default: return "circle";
    }
  };

  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        // --- SPECIAL RENDER FOR 'AR' BUTTON ---
        if (route.name === "AR") {
          return (
            <TouchableOpacity
              key={route.key}
              style={styles.arButtonContainer}
              onPress={onPress}
              activeOpacity={0.8}
            >
              <View style={styles.arButton}>
                 <Icon name="camera" size={28} color="#fff" />
              </View>
            </TouchableOpacity>
          );
        }

        // --- STANDARD TABS ---
        return (
          <TouchableOpacity
            key={route.key}
            style={styles.navItem}
            onPress={onPress}
            activeOpacity={0.6}
          >
            {/* Icon */}
            <Icon
              name={getIconName(route.name)}
              size={24}
              color={isFocused ? COLORS.ACTIVE : COLORS.INACTIVE}
              style={isFocused ? styles.glow : undefined}
            />
            
            {/* Label (Only show if active or keep generic) */}
            <Text style={[
              styles.navLabel, 
              { color: isFocused ? COLORS.ACTIVE : COLORS.INACTIVE }
            ]}>
              {route.name}
            </Text>

            {/* Little 'Light' indicator for active tabs */}
            {isFocused && <View style={styles.activeDot} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: COLORS.BODY,
    paddingBottom: Platform.OS === 'ios' ? 25 : 10,
    paddingTop: 10,
    paddingHorizontal: 10,
    
    // BMO Style Border top
    borderTopWidth: 6,
    borderTopColor: COLORS.BORDER,
    
    // Shadow/Elevation
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 50,
  },
  
  navLabel: {
    fontSize: 10,
    marginTop: 4,
    fontWeight: "bold",
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', // Retro font
  },
  
  glow: {
    // Optional: Add text shadow for a "glowing" effect on the yellow
    textShadowColor: 'rgba(244, 211, 94, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },

  activeDot: {
    position: 'absolute',
    top: 5,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.ACTIVE,
  },

  // --- AR BUTTON STYLES ---
  arButtonContainer: {
    top: -25, // Pops out of the navbar
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  arButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.RED_BTN,
    justifyContent: 'center',
    alignItems: 'center',
    
    // 3D Button Effect
    borderBottomWidth: 4,
    borderBottomColor: 'rgba(0,0,0,0.2)',
    borderWidth: 2,
    borderColor: '#fff',
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});

export default BottomNavbar;