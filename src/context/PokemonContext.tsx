// src/context/PokemonContext.tsx

import React, { createContext, useState, useEffect, FC, ReactNode } from 'react';
import axios from 'axios';
import { PokemonBasic } from '../types'; 

// --- 1. Define Context Types ---
interface PokemonContextType {
    pokemonList: PokemonBasic[]; 
    filteredList: PokemonBasic[]; 
    loading: boolean;
    error: string | null;
    searchPokemon: (query: string) => void; 
}

const defaultContextValue: PokemonContextType = {
    pokemonList: [],
    filteredList: [],
    loading: true,
    error: null,
    searchPokemon: () => {},
};

export const PokemonContext = createContext<PokemonContextType>(defaultContextValue);

// --- 2. Define API Call ---
const POKEAPI_URL = 'https://pokeapi.co/api/v2/pokemon?limit=151'; 

const fetchPokemonList = async (): Promise<PokemonBasic[]> => {
    const response = await axios.get(POKEAPI_URL);
    
    return response.data.results.map((p: any, index: number) => {
        const id = (index + 1).toString();
        return {
            id: id,
            name: p.name.charAt(0).toUpperCase() + p.name.slice(1),
            url: p.url,
            imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
        };
    });
};

// --- 3. Context Provider Component ---

export const PokemonProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [pokemonList, setPokemonList] = useState<PokemonBasic[]>([]);
    const [filteredList, setFilteredList] = useState<PokemonBasic[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadPokemon = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchPokemonList();
            setPokemonList(data);
            setFilteredList(data); 
        } catch (err) {
            // 🚨 IMPROVED ERROR LOGGING: This helps diagnose the "Failed to load Pokedex data"
            console.error("Failed to fetch Pokémon list:", err);
            
            let errorMessage = "Failed to load Pokémon data. Check your network.";
            if (axios.isAxiosError(err) && err.response) {
                errorMessage = `API Error: Could not reach PokeAPI (Status: ${err.response.status}).`;
            } else if (axios.isAxiosError(err)) {
                errorMessage = `Network Error: ${err.message}. Check device connection.`;
            }
            
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        loadPokemon();
    }, []);

    const searchPokemon = (query: string) => {
        if (!query) {
            setFilteredList(pokemonList);
            return;
        }

        const lowerQuery = query.toLowerCase();

        const results = pokemonList.filter(p => {
            return p.name.toLowerCase().includes(lowerQuery) || p.id === lowerQuery;
        });

        setFilteredList(results);
    };

    const contextValue: PokemonContextType = { 
        pokemonList, 
        filteredList, 
        loading, 
        error,
        searchPokemon 
    };

    return (
        <PokemonContext.Provider value={contextValue}>
            {children}
        </PokemonContext.Provider>
    );
};