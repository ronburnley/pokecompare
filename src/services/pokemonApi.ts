import axios from 'axios';
import { Pokemon, PokemonListResponse, MegaEvolution, GigantamaxForm } from '../types/pokemon';

const API_URL = 'https://pokeapi.co/api/v2';

// Mapping of Pokémon IDs to their mega evolution(s) form names
const megaEvolutionMap: Record<number, string[]> = {
  3: ['venusaur-mega'], // Venusaur
  6: ['charizard-mega-x', 'charizard-mega-y'], // Charizard
  9: ['blastoise-mega'], // Blastoise
  15: ['beedrill-mega'], // Beedrill
  18: ['pidgeot-mega'], // Pidgeot
  65: ['alakazam-mega'], // Alakazam
  94: ['gengar-mega'], // Gengar
  115: ['kangaskhan-mega'], // Kangaskhan
  127: ['pinsir-mega'], // Pinsir
  130: ['gyarados-mega'], // Gyarados
  142: ['aerodactyl-mega'], // Aerodactyl
  150: ['mewtwo-mega-x', 'mewtwo-mega-y'], // Mewtwo
  181: ['ampharos-mega'], // Ampharos
  212: ['scizor-mega'], // Scizor
  214: ['heracross-mega'], // Heracross
  229: ['houndoom-mega'], // Houndoom
  248: ['tyranitar-mega'], // Tyranitar
  254: ['sceptile-mega'], // Sceptile
  257: ['blaziken-mega'], // Blaziken
  260: ['swampert-mega'], // Swampert
  282: ['gardevoir-mega'], // Gardevoir
  302: ['sableye-mega'], // Sableye
  303: ['mawile-mega'], // Mawile
  306: ['aggron-mega'], // Aggron
  308: ['medicham-mega'], // Medicham
  310: ['manectric-mega'], // Manectric
  354: ['banette-mega'], // Banette
  359: ['absol-mega'], // Absol
  380: ['latias-mega'], // Latias
  381: ['latios-mega'], // Latios
  445: ['garchomp-mega'], // Garchomp
  448: ['lucario-mega'], // Lucario
  460: ['abomasnow-mega'], // Abomasnow
  475: ['gallade-mega'], // Gallade
  531: ['audino-mega'], // Audino
  719: ['diancie-mega'], // Diancie
};

// Mapping of Pokémon IDs to their Gigantamax form names
const gigantamaxMap: Record<number, string> = {
  3: 'venusaur-gmax', // Venusaur
  6: 'charizard-gmax', // Charizard
  9: 'blastoise-gmax', // Blastoise
  12: 'butterfree-gmax', // Butterfree
  25: 'pikachu-gmax', // Pikachu
  52: 'meowth-gmax', // Meowth
  68: 'machamp-gmax', // Machamp
  94: 'gengar-gmax', // Gengar
  99: 'kingler-gmax', // Kingler
  131: 'lapras-gmax', // Lapras
  133: 'eevee-gmax', // Eevee
  143: 'snorlax-gmax', // Snorlax
  569: 'garbodor-gmax', // Garbodor
  809: 'melmetal-gmax', // Melmetal
  823: 'corviknight-gmax', // Corviknight
  826: 'orbeetle-gmax', // Orbeetle
  834: 'drednaw-gmax', // Drednaw
  839: 'coalossal-gmax', // Coalossal
  841: 'flapple-gmax', // Flapple
  842: 'appletun-gmax', // Appletun
  844: 'sandaconda-gmax', // Sandaconda
  849: 'toxtricity-amped-gmax', // Toxtricity Amped
  851: 'centiskorch-gmax', // Centiskorch
  858: 'hatterene-gmax', // Hatterene
  861: 'grimmsnarl-gmax', // Grimmsnarl
  869: 'alcremie-gmax', // Alcremie
  879: 'copperajah-gmax', // Copperajah
  884: 'duraludon-gmax', // Duraludon
  892: 'urshifu-single-strike-gmax', // Urshifu Single Strike
  893: 'urshifu-rapid-strike-gmax', // Urshifu Rapid Strike
};

export const fetchPokemonList = async (limit = 20, offset = 0): Promise<PokemonListResponse> => {
  const response = await axios.get(`${API_URL}/pokemon?limit=${limit}&offset=${offset}`);
  return response.data;
};

export const fetchPokemon = async (nameOrId: string | number): Promise<Pokemon> => {
  const response = await axios.get(`${API_URL}/pokemon/${nameOrId}`);
  const pokemon = response.data;
  
  // Process ID-based lookups for Mega and Gigantamax forms
  if (typeof nameOrId === 'number' || !isNaN(parseInt(nameOrId as string))) {
    const id = typeof nameOrId === 'number' ? nameOrId : parseInt(nameOrId as string);
    
    // If this Pokémon has mega evolutions, fetch them
    const megaForms = megaEvolutionMap[id] || [];
    
    if (megaForms.length > 0) {
      const megaEvolutions = await Promise.all(
        megaForms.map(async (formName) => {
          try {
            const megaResponse = await axios.get(`${API_URL}/pokemon/${formName}`);
            return megaResponse.data as MegaEvolution;
          } catch (error) {
            console.error(`Failed to fetch mega evolution ${formName}:`, error);
            return null;
          }
        })
      );
      
      // Filter out any failed requests
      pokemon.mega_evolutions = megaEvolutions.filter(Boolean);
    }
    
    // If this Pokémon has a Gigantamax form, fetch it
    const gigantamaxForm = gigantamaxMap[id];
    
    if (gigantamaxForm) {
      try {
        const gmaxResponse = await axios.get(`${API_URL}/pokemon/${gigantamaxForm}`);
        pokemon.gigantamax_form = gmaxResponse.data as GigantamaxForm;
      } catch (error) {
        console.error(`Failed to fetch Gigantamax form ${gigantamaxForm}:`, error);
      }
    }
  }
  
  return pokemon;
};

export const searchPokemon = async (query: string): Promise<PokemonListResponse> => {
  const response = await axios.get(`${API_URL}/pokemon?limit=1000`);
  const data = response.data as PokemonListResponse;
  
  const filteredResults = data.results.filter(pokemon => 
    pokemon.name.toLowerCase().includes(query.toLowerCase())
  );
  
  return {
    count: filteredResults.length,
    next: null,
    previous: null,
    results: filteredResults
  };
};