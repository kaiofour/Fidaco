import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import SignInScreen from "./src/screens/SignInScreen";
import HomeScreen from "./src/screens/HomeScreen";

import ProfileScreen from "./src/screens/ProfileScreen";
import AugmentedReality from "./src/screens/AugmentedReality";


import SignUpScreen from "./src/screens/SignUpScreen";
import Feed from "./src/screens/Feed";
import Pokedex from "./src/screens/Pokedex";


const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />

        {/* <Stack.Screen name="SignIn" component={SignInScreen} /> */}
        {/* <Stack.Screen name="Pokedex" component={Pokedex} /> */}


        {/* <Stack.Screen name="Profile" component={ProfileScreen} /> */}
        {/* <Stack.Screen name="AR" component={AugmentedReality} /> */}
        

        {/* <Stack.Screen name="SignUp" component={SignUpScreen} /> */}
        {/* <Stack.Screen name="Hunt" component={Hunt} /> */}



        {/* <Stack.Screen name="Feed" component={Feed} /> */}
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}
