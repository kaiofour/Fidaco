import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// 1. IMPORT SCREENS
import SignInScreen from "./src/screens/SignInScreen";
import SignUpScreen from "./src/screens/SignUpScreen";
import HomeScreen from "./src/screens/HomeScreen"; 
import ProfileScreen from "./src/screens/ProfileScreen";
import AugmentedReality from "./src/screens/AugmentedReality";
import Hunt from "./src/screens/Hunt"; 
import Pokedex from "./src/screens/Pokedex"; // Assuming you will put the Pokedex grid here later

// 2. IMPORT YOUR CUSTOM NAVBAR
import BottomNavbar from "./src/components/BottomNavbar";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// 3. DEFINE THE TAB NAVIGATOR (The Main App)
function MainTabNavigator() {
  return (
    <Tab.Navigator
      // Connects your custom BottomNavbar component
      tabBar={(props) => <BottomNavbar {...props} />} 
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Hunt" component={Hunt} />
      
      {/* Pokedex Tab */}
      <Tab.Screen name="Pokedex" component={Pokedex} />
      
      <Tab.Screen name="AR" component={AugmentedReality} />
      
      {/* Feed Tab NOW POINTS TO HomeScreen */}
      <Tab.Screen name="Feed" component={HomeScreen} />
      
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// 4. DEFINE THE ROOT STACK (Login -> Main App)
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        
        {/* Authentication Screens */}
        {/* <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} /> */}

        {/* Main App */}
        <Stack.Screen name="MainTabs" component={MainTabNavigator} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}