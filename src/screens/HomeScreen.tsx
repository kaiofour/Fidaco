import React, { useEffect, useState, FC } from 'react';
import { 
    View, 
    Text, 
    FlatList, 
    Image, 
    StyleSheet, 
    ActivityIndicator,
    SafeAreaView
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/Feather';

// 1. Types
type FeedItem = {
    id: string;
    username: string;
    pokemonName: string;
    timestamp: any; // Firestore timestamp
    biome: string;
};

// 2. Helper to get Pokémon Image from Name
// We use the same logic as PokedexScreen but simpler (direct URL construction)
const getPokemonImageUrl = (name: string) => {
    // Convert "Mr. Mime" -> "mr-mime" for API consistency if needed, 
    // but usually lowercase is enough for the sprite URL.
    const cleanName = name.toLowerCase().replace('.', '').replace(' ', '-');
    // Using the official artwork or sprite
    return `https://img.pokemondb.net/sprites/home/normal/${cleanName}.png`;
};

// 3. Single Feed Card Component
const FeedCard: FC<{ item: FeedItem }> = ({ item }) => {
    const imageUrl = getPokemonImageUrl(item.pokemonName);
    
    // Format timestamp
    const timeString = item.timestamp?.toDate 
        ? item.timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : 'Just now';

    return (
        <View style={styles.card}>
            {/* Left: Pokemon Image */}
            <View style={[styles.imageContainer, { 
                backgroundColor: item.biome === 'water' ? '#E3F2FD' : item.biome === 'urban' ? '#F3E5F5' : '#E8F5E9' 
            }]}>
                <Image 
                    source={{ uri: imageUrl }} 
                    style={styles.sprite} 
                />
            </View>

            {/* Right: Text Info */}
            <View style={styles.textContainer}>
                <View style={styles.headerRow}>
                    <Text style={styles.username}>{item.username}</Text>
                    <Text style={styles.timestamp}>{timeString}</Text>
                </View>
                
                <Text style={styles.actionText}>
                    caught a <Text style={styles.pokemonName}>{item.pokemonName}</Text>!
                </Text>

                <View style={styles.badgeRow}>
                    <Icon name="map-pin" size={12} color="#888" />
                    <Text style={styles.biomeText}>{item.biome} biome</Text>
                </View>
            </View>
        </View>
    );
};

// 4. Main Feed Screen
const HomeScreen: FC = () => {
    const [feedData, setFeedData] = useState<FeedItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Subscribe to the "feed" collection in real-time
        const subscriber = firestore()
            .collection('feed')
            .orderBy('timestamp', 'desc') // Newest first
            .limit(50) // Show last 50 catches
            .onSnapshot(querySnapshot => {
                const list: FeedItem[] = [];
                querySnapshot.forEach(documentSnapshot => {
                    list.push({
                        id: documentSnapshot.id,
                        ...documentSnapshot.data(),
                    } as FeedItem);
                });

                setFeedData(list);
                setLoading(false);
            }, error => {
                console.error(error);
                setLoading(false);
            });

        // Unsubscribe when screen unmounts
        return () => subscriber();
    }, []);

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#CC0000" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Global Catch Feed</Text>
            </View>

            <FlatList
                data={feedData}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <FeedCard item={item} />}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.center}>
                        <Text style={styles.emptyText}>No catches yet. Be the first!</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F2F2F2' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 },
    
    header: {
        backgroundColor: '#CC0000',
        paddingVertical: 15,
        alignItems: 'center',
        elevation: 4,
    },
    headerTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },

    listContent: {
        padding: 10,
    },
    
    // Card Styles
    card: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 12,
        marginBottom: 10,
        alignItems: 'center',
        elevation: 2, // Shadow for Android
        shadowColor: '#000', // Shadow for iOS
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    imageContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    sprite: {
        width: 50,
        height: 50,
        resizeMode: 'contain',
    },
    textContainer: {
        flex: 1,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    username: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    timestamp: {
        fontSize: 12,
        color: '#999',
    },
    actionText: {
        fontSize: 14,
        color: '#555',
        marginBottom: 6,
    },
    pokemonName: {
        fontWeight: 'bold',
        color: '#CC0000', // Red highlight for pokemon name
        textTransform: 'capitalize',
    },
    badgeRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    biomeText: {
        fontSize: 12,
        color: '#888',
        marginLeft: 4,
        textTransform: 'capitalize',
    },
    emptyText: {
        color: '#888',
        fontSize: 16,
    }
});

export default HomeScreen;