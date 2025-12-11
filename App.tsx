// App.tsx

import 'react-native-gesture-handler';
import React, { FC } from 'react';
import { NavigationContainer, RouteProp } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// --- IMPORTS ---
import SignInScreen from './src/screens/SignInScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import PokedexScreen from './src/screens/PokedexScreen'; 
import PokemonDetailScreen from './src/screens/PokemonDetailScreen';
import AugmentedReality from './src/screens/AugmentedReality';
import HomeScreen from './src/screens/HomeScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import Hunt from './src/screens/Hunt';
import BottomNavbar from './src/components/BottomNavbar';

// 🚨 NEW IMPORT: Context Provider
import { PokemonProvider } from './src/context/PokemonContext'; 

// ----------------------------------------------------
// 1. DEFINE NAVIGATOR TYPES (Param Lists)
// ----------------------------------------------------

type PokedexStackParamList = {
    PokedexList: undefined;
    PokemonDetail: { pokemonId: string; pokemonName: string; pokemonImage: string; pokemonColor?: string; };
};

type AuthStackParamList = {
    SignIn: undefined;
    SignUp: undefined;
    PublicPokedex: undefined; 
};

type MainTabParamList = {
    Hunt: undefined;
    Pokedex: undefined;
    AR: undefined;
    Feed: undefined;
    Profile: undefined;
};

type RootStackParamList = {
    Auth: undefined;
    MainTabs: undefined;
};


// ----------------------------------------------------
// 2. INSTANTIATE TYPED NAVIGATORS
// ----------------------------------------------------

const RootStack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();
const PokedexStack = createStackNavigator<PokedexStackParamList>(); 
const AuthStack = createStackNavigator<AuthStackParamList>(); 

// ----------------------------------------------------
// 3. HELPER/WRAPPER COMPONENTS
// ----------------------------------------------------

// Wrapper component to fix the component type error in the Auth Stack
const PublicPokedexWrapper: FC = (props: any) => {
    return <PokedexScreen {...props} />;
};


// ----------------------------------------------------
// 4. NAVIGATOR COMPONENTS
// ----------------------------------------------------

function PokedexFlow() {
    return (
        <PokedexStack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: '#CC0000' },
                headerTintColor: '#fff',
                headerTitleStyle: { fontWeight: 'bold' },
            }}
        >
            <PokedexStack.Screen 
                name="PokedexList" 
                component={PokedexScreen} 
                options={{ title: 'PokeExplorer Pokedex' }}
            />
            <PokedexStack.Screen 
                name="PokemonDetail" 
                component={PokemonDetailScreen} 
                options={({ route }: { route: RouteProp<PokedexStackParamList, 'PokemonDetail'> }) => ({
                    title: route.params.pokemonName || 'Details',
                })}
            />
        </PokedexStack.Navigator>
    );
}

function MainTabNavigator() {
    return (
        <Tab.Navigator
            initialRouteName="Pokedex" 
            tabBar={(props) => <BottomNavbar {...props} />}
            screenOptions={{ headerShown: false }}
        >
            <Tab.Screen name="Hunt" component={Hunt} />
            <Tab.Screen name="Pokedex" component={PokedexFlow} />
            <Tab.Screen name="AR" component={AugmentedReality} />
            <Tab.Screen name="Feed" component={HomeScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
}

function AuthStackComponent() {
    return (
        <AuthStack.Navigator screenOptions={{ headerShown: false }}>
            <AuthStack.Screen name="SignIn" component={SignInScreen} />
            <AuthStack.Screen name="SignUp" component={SignUpScreen} />
            <AuthStack.Screen name="PublicPokedex" component={PublicPokedexWrapper} />
        </AuthStack.Navigator>
    );
}

// ----------------------------------------------------
// 5. ROOT APP COMPONENT (Fixed Conditional Logic)
// ----------------------------------------------------

const App: FC = () => {
    // Set to true to display the Pokedex immediately
    const userLoggedIn = true; 

    // Determines the starting route of the app
    const initialRoute = userLoggedIn ? 'MainTabs' : 'Auth'; 

    return (
        // 🚨 Wrapping the entire navigation structure with the Provider
        <PokemonProvider>
            <NavigationContainer>
                <RootStack.Navigator 
                    screenOptions={{ headerShown: false }}
                    initialRouteName={initialRoute} // Correctly sets the initial screen
                >
                    {/* Define all possible screens in the Root Navigator once */}
                    <RootStack.Screen name="Auth" component={AuthStackComponent} />
                    <RootStack.Screen name="MainTabs" component={MainTabNavigator} />
                </RootStack.Navigator>
            </NavigationContainer>
        </PokemonProvider>
    );
};

export default App;