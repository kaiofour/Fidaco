// src/screens/PokedexScreen.tsx

import React, { useContext, useState, FC } from 'react';
import { 
    View, 
    Text, 
    FlatList, 
    Image, // Ensure Image is imported
    TouchableOpacity, 
    TextInput, 
    StyleSheet, 
    ActivityIndicator, 
    Dimensions 
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { PokemonContext } from '../context/PokemonContext';
import { PokemonBasic } from '../types';

// Define the NESTED STACK param list used in App.tsx (PokedexStackParamList)
type PokedexStackParamList = {
    PokedexList: undefined;
    PokemonDetail: { pokemonId: string; pokemonName: string; pokemonImage: string };
};

type Props = StackScreenProps<PokedexStackParamList, 'PokedexList'>;

// Component for a single card
const PokemonCard: FC<{ item: PokemonBasic; navigate: Props['navigation']['navigate'] }> = ({ item, navigate }) => {
    return (
        <TouchableOpacity 
            style={styles.card} 
            onPress={() => navigate('PokemonDetail', { 
                pokemonId: item.id, 
                pokemonName: item.name, 
                pokemonImage: item.imageUrl // Correctly using imageUrl
            })}
        >
            <View style={styles.cardContent}>
                <Text style={styles.idText}>#{item.id}</Text>
                {/* 🚀 IMAGE RENDERING: source is set, and style.sprite defines dimensions */}
                <Image 
                    source={{ uri: item.imageUrl }} 
                    style={styles.sprite} // Must have width/height defined here
                />
                <Text style={styles.nameText}>{item.name}</Text>
            </View>
        </TouchableOpacity>
    );
};

const PokedexScreen: FC<Props> = ({ navigation }) => {
    // Access filteredList, loading, and searchPokemon from context
    const { filteredList, loading, searchPokemon, error } = useContext(PokemonContext); 
    const [searchText, setSearchText] = useState('');

    const handleSearch = (text: string) => {
        setSearchText(text);
        searchPokemon(text);
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#FF3D00" />
                <Text style={styles.loadingText}>Loading Pokedex...</Text>
            </View>
        );
    }
    
    // Display API error if fetching failed
    if (error) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>Error: {error}</Text>
                <Text style={styles.errorText}>Please check network or API connection.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <TextInput 
                    style={styles.searchInput}
                    placeholder="Search by name or ID..."
                    value={searchText}
                    onChangeText={handleSearch}
                    placeholderTextColor="#EFEFEF"
                />
            </View>

            {/* Pokemon Grid */}
            <FlatList
                data={filteredList}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <PokemonCard item={item} navigate={navigation.navigate} />}
                numColumns={2}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={() => (
                    <View style={styles.center}>
                        <Text style={styles.emptyText}>No Pokémon found!</Text>
                    </View>
                )}
            />
        </View>
    );
};

// Styles for clean, Pokemon-themed UI
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#E0E0E0' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { marginTop: 10, color: '#333' },
    errorText: { marginTop: 10, color: 'red', textAlign: 'center' }, // New style for error display
    emptyText: { marginTop: 50, color: '#666', fontSize: 16 },
    searchContainer: { padding: 10, backgroundColor: '#CC0000', borderBottomWidth: 3, borderBottomColor: '#A00000' },
    searchInput: { 
        backgroundColor: '#fff', 
        borderRadius: 8, 
        paddingHorizontal: 16, 
        height: 40,
        fontSize: 16,
    },
    listContainer: { padding: 4 },
    card: {
        flex: 1,
        margin: 4,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
        padding: 10,
        minHeight: Dimensions.get('window').width / 2 - 12, 
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    // 💡 KEY FIX: Image requires explicit width and height
    sprite: { 
        width: 100, 
        height: 100, 
        marginBottom: 5,
        resizeMode: 'contain', // Ensure the image fits within the bounds
    },
    nameText: { fontSize: 14, fontWeight: 'bold', color: '#333', textAlign: 'center' },
    idText: { position: 'absolute', top: 5, right: 8, color: '#888', fontSize: 12 },
    cardContent: { flex: 1, justifyContent: 'space-between', alignItems: 'center', width: '100%' },
});

export default PokedexScreen;