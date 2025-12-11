// src/types/index.ts (Complete and Corrected)

export interface PokemonBasic {
  id: string;
  name: string;
  url: string;
  imageUrl: string;
}

// ------------------------------------------------
// 🚀 Exported Types for Pokemon Details
// ------------------------------------------------
export interface PokemonTypeSlot {
    slot: number;
    type: {
        name: string;
        url: string;
    };
}

export interface PokemonStat {
    base_stat: number;
    effort: number;
    stat: {
        name: string;
        url: string;
    };
}

export interface PokemonAbility {
    ability: {
        name: string;
        url: string;
    };
    is_hidden: boolean;
    slot: number;
}


// ------------------------------------------------
// 🚀 Sprites Structure
// ------------------------------------------------
interface OfficialArtwork {
    front_default: string | null;
}

interface OtherSprites {
    'official-artwork': OfficialArtwork;
}

export interface PokemonSprites { // Exporting PokemonSprites just in case
    front_default: string | null;
    other: OtherSprites;
}
// ------------------------------------------------


// Full detail interface used by PokemonDetailScreen
export interface PokemonDetail {
    id: number;
    name: string;
    height: number;
    weight: number;
    types: PokemonTypeSlot[];
    stats: PokemonStat[];
    abilities: PokemonAbility[];
    flavorText: string; 
    
    // The required sprite data
    sprites: PokemonSprites; 
}