import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Feather";

const BottomNavbar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  
  // This helper function gets the icon name based on the route name
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
    <View style={styles.bottomNav}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        
        // Check if this tab is currently active
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

        return (
          <TouchableOpacity
            key={route.key}
            style={styles.navItem}
            onPress={onPress}
          >
            <Icon
              name={getIconName(route.name)}
              size={24}
              color={isFocused ? "#FF5733" : "#888"}
            />
            <Text style={[styles.navLabel, isFocused && styles.activeLabel]}>
              {route.name}
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
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