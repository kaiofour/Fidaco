// src/api/pokeApi.ts

import axios from 'axios';
import { PokemonDetail, PokemonBasic } from '../types';

const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2/pokemon';
const POKESPECIES_BASE_URL = 'https://pokeapi.co/api/v2/pokemon-species';

// Function to fetch details for a single Pokémon
export const fetchPokemonDetails = async (id: string): Promise<PokemonDetail> => {
    // Fetch main details and species data concurrently
    const [detailResponse, speciesResponse] = await Promise.all([
        axios.get(`${POKEAPI_BASE_URL}/${id}`),
        axios.get(`${POKESPECIES_BASE_URL}/${id}`),
    ]);

    const rawDetails = detailResponse.data;
    const rawSpecies = speciesResponse.data;

    // Find the English flavor text description
    const flavorTextEntry = rawSpecies.flavor_text_entries.find(
        (entry: any) => entry.language.name === 'en'
    );
    const flavorText = flavorTextEntry ? flavorTextEntry.flavor_text.replace(/[\n\f]/g, ' ') : 'No description available.';

    // Construct the final PokemonDetail object
    const details: PokemonDetail = {
        id: rawDetails.id,
        name: rawDetails.name,
        height: rawDetails.height,
        weight: rawDetails.weight,
        types: rawDetails.types,
        stats: rawDetails.stats,
        abilities: rawDetails.abilities,
        flavorText: flavorText,
        // This is where the required sprites data is attached
        sprites: rawDetails.sprites,
    };

    return details;
};