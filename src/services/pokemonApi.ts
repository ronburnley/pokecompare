import axios from 'axios';
import { Pokemon, PokemonListResponse } from '../types/pokemon';

const API_URL = 'https://pokeapi.co/api/v2';

export const fetchPokemonList = async (limit = 20, offset = 0): Promise<PokemonListResponse> => {
  const response = await axios.get(`${API_URL}/pokemon?limit=${limit}&offset=${offset}`);
  return response.data;
};

export const fetchPokemon = async (nameOrId: string | number): Promise<Pokemon> => {
  const response = await axios.get(`${API_URL}/pokemon/${nameOrId}`);
  return response.data;
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