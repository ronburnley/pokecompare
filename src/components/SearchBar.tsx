import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Input, Button } from '../styles/StyledComponents';
import axios from 'axios';
import { PokemonListItem } from '../types/pokemon';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const SearchContainer = styled.div`
  margin: 20px 0;
  width: 100%;
  position: relative;
`;

const SearchWrapper = styled.div`
  display: flex;
  width: 100%;
`;

const SearchInput = styled(Input)`
  border-radius: 8px 0 0 8px;
  border-right: none;
  flex: 1;
`;

const SearchButton = styled(Button)`
  border-radius: 0 8px 8px 0;
  white-space: nowrap;
  padding: 12px 24px;
  margin-left: -1px; /* Fix potential double border */
`;

const SuggestionsContainer = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  max-height: 300px;
  overflow-y: auto;
  background-color: white;
  border: 1px solid #ddd;
  border-top: none;
  border-radius: 0 0 8px 8px;
  z-index: 10;
  padding: 0;
  margin: 0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const SuggestionItem = styled.li`
  padding: 10px 16px;
  cursor: pointer;
  list-style: none;
  text-transform: capitalize;

  &:hover {
    background-color: #f5f5f5;
  }
`;

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  placeholder = 'Search Pokémon...' 
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<PokemonListItem[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [allPokemon, setAllPokemon] = useState<PokemonListItem[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch all Pokémon names once on component mount
  useEffect(() => {
    const fetchAllPokemon = async () => {
      try {
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=1000');
        setAllPokemon(response.data.results);
      } catch (error) {
        console.error('Error fetching Pokémon list:', error);
      }
    };

    fetchAllPokemon();
  }, []);

  // Handle clicks outside the suggestions container
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filter suggestions based on query
  useEffect(() => {
    if (query.trim() === '') {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const filteredPokemon = allPokemon.filter(pokemon => 
      pokemon.name.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 10); // Limit to 10 suggestions

    setSuggestions(filteredPokemon);
    setShowSuggestions(true);
  }, [query, allPokemon]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (pokemonName: string) => {
    setQuery(pokemonName);
    onSearch(pokemonName);
    setShowSuggestions(false);
  };

  return (
    <SearchContainer ref={containerRef}>
      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <SearchWrapper>
          <SearchInput
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            autoComplete="off"
          />
          <SearchButton type="submit">Search</SearchButton>
        </SearchWrapper>
      </form>
      
      {showSuggestions && suggestions.length > 0 && (
        <SuggestionsContainer>
          {suggestions.map((pokemon) => (
            <SuggestionItem
              key={pokemon.name}
              onClick={() => handleSuggestionClick(pokemon.name)}
            >
              {pokemon.name}
            </SuggestionItem>
          ))}
        </SuggestionsContainer>
      )}
    </SearchContainer>
  );
};

export default SearchBar;