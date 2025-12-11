// src/screens/PokemonDetailScreen.tsx

import React, { useEffect, useState, FC } from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { fetchPokemonDetails } from '../api/pokeApi'; // 🐛 FIX: Now imported from the new file
import { PokemonDetail, PokemonStat } from '../types';

// Define the NESTED STACK param list (Needs to match App.tsx)
type RootStackParamList = {
    PokedexList: undefined;
    PokemonDetail: { pokemonId: string; pokemonName: string; pokemonImage: string };
};

type Props = StackScreenProps<RootStackParamList, 'PokemonDetail'>;

// Helper to colorize type badges (UX Design)
const getTypeColor = (type: string): string => {
    switch (type) {
        case 'fire': return '#F08030'; case 'water': return '#6890F0';
        case 'grass': return '#78C850'; case 'electric': return '#F8D030';
        case 'ice': return '#98D8D8'; case 'fighting': return '#C03028';
        case 'poison': return '#A040A0'; case 'ground': return '#E0C068';
        case 'flying': return '#A890F0'; case 'psychic': return '#F85888';
        case 'bug': return '#A8B820'; case 'rock': return '#B8A038';
        case 'ghost': return '#705898'; case 'dragon': return '#7038F8';
        case 'steel': return '#B8B8D0'; case 'dark': return '#705848';
        case 'fairy': return '#EE99AC'; case 'normal': return '#A8A878';
        default: return '#68A090'; // Unknown type
    }
};

const StatBar: FC<{ stat: PokemonStat }> = ({ stat }) => {
    const statName = stat.stat.name.replace(/-/g, ' ').toUpperCase();
    // Max value for the bar visualization, ensuring the bar doesn't overflow for very high stats
    const maxStatValue = 150; 
    const percentage = (stat.base_stat / maxStatValue) * 100;

    return (
        <View style={statStyles.barContainer}>
            <Text style={statStyles.statName}>{statName}</Text>
            <View style={statStyles.barBackground}>
                <View 
                    style={[statStyles.barFill, { width: `${percentage > 100 ? 100 : percentage}%` }]} 
                />
            </View>
            <Text style={statStyles.statValue}>{stat.base_stat}</Text>
        </View>
    );
};

const PokemonDetailScreen: FC<Props> = ({ route }) => {
    const { pokemonId, pokemonImage } = route.params;
    
    const [details, setDetails] = useState<PokemonDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDetails = async () => {
            try {
                setLoading(true);
                const data = await fetchPokemonDetails(pokemonId);
                setDetails(data);
            } catch (error) {
                console.error("Failed to load Pokemon details:", error);
                // Set details to null or show a user error message
            } finally {
                setLoading(false);
            }
        };
        loadDetails();
    }, [pokemonId]);

    if (loading || !details) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#CC0000" />
                <Text style={styles.loadingText}>Loading details for #{pokemonId}...</Text>
            </View>
        );
    }

    // --- Displaying the details ---
    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
            {/* Header Image and Name */}
            <View style={styles.header}>
                {/* 🐛 FIX: Access the image URL safely. The default image from PokedexList is used as fallback. */}
                <Image 
                    source={{ uri: details.sprites.other['official-artwork'].front_default || pokemonImage }} 
                    style={styles.mainImage} 
                />
                <Text style={styles.name}>
                    {details.name.charAt(0).toUpperCase() + details.name.slice(1)} (#{details.id})
                </Text>
            </View>

            {/* Types and General Info */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Types</Text>
                <View style={styles.typesContainer}>
                    {details.types.map((type, index) => (
                        <View key={index} style={[styles.typeBadge, { backgroundColor: getTypeColor(type.type.name) }]}>
                            <Text style={styles.typeText}>{type.type.name.toUpperCase()}</Text>
                        </View>
                    ))}
                </View>
                <Text style={styles.infoText}>Height: {(details.height / 10).toFixed(1)} m</Text>
                <Text style={styles.infoText}>Weight: {(details.weight / 10).toFixed(1)} kg</Text>
            </View>

            {/* Flavor Text / Description */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Description</Text>
                <Text style={styles.flavorText}>{details.flavorText}</Text>
            </View>
            
            {/* Base Stats */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Base Stats</Text>
                {details.stats.map((stat, index) => (
                    <StatBar key={index} stat={stat} />
                ))}
            </View>

            {/* Abilities */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Abilities</Text>
                {details.abilities.map((ability, index) => (
                    <Text key={index} style={styles.abilityText}>
                        • {ability.ability.name.replace(/-/g, ' ').toUpperCase()} {ability.is_hidden ? '(Hidden)' : ''}
                    </Text>
                ))}
            </View>

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    scrollContent: { paddingBottom: 50 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { marginTop: 10, color: '#333' },
    
    header: { alignItems: 'center', padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#ddd' },
    mainImage: { width: 180, height: 180 },
    name: { fontSize: 28, fontWeight: 'bold', marginTop: 10, color: '#333' },

    section: { paddingHorizontal: 20, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
    sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: '#CC0000' },

    typesContainer: { flexDirection: 'row', marginBottom: 10 },
    typeBadge: { 
        borderRadius: 15, paddingHorizontal: 10, paddingVertical: 5, marginRight: 8,
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 1.41, elevation: 2 
    },
    typeText: { color: 'white', fontWeight: 'bold', fontSize: 12 },
    
    infoText: { fontSize: 16, color: '#444', marginBottom: 4 },
    flavorText: { fontSize: 15, fontStyle: 'italic', color: '#555', lineHeight: 22 },
    abilityText: { fontSize: 15, color: '#444' },
});

const statStyles = StyleSheet.create({
    barContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
    statName: { width: 80, fontSize: 12, fontWeight: '600', color: '#666' },
    barBackground: { flex: 1, height: 10, backgroundColor: '#E0E0E0', borderRadius: 5, marginHorizontal: 10 },
    barFill: { height: '100%', borderRadius: 5, backgroundColor: '#007ACC' },
    statValue: { width: 30, fontSize: 14, fontWeight: 'bold', color: '#333', textAlign: 'right' },
});

export default PokemonDetailScreen;