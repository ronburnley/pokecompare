import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import styled from 'styled-components';
import { fetchPokemonList, fetchPokemon, searchPokemon } from '../services/pokemonApi';
import { Pokemon } from '../types/pokemon';
import { 
  Container, 
  Heading, 
  Button, 
  Text, 
  Grid, 
  LoadingSpinner, 
  ErrorMessage,
  CompareContainer,
  Flex
} from '../styles/StyledComponents';
import PokemonCard from '../components/PokemonCard';
import PokemonDetailCard from '../components/PokemonDetailCard';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';

const ComparePageContainer = styled(Container)`
  padding-top: 40px;
  padding-bottom: 40px;
`;

const BackButton = styled(Button)`
  margin-bottom: 20px;
  background-color: #3b5ca8;
`;

const VSBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 700;
  color: #ff5350;
  
  @media (max-width: 768px) {
    margin: 16px 0;
  }
`;

const EmptySlot = styled.div`
  background-color: #f0f0f0;
  border-radius: 12px;
  padding: 24px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
`;

const Compare: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialPokemonId = queryParams.get('pokemon');
  
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon[]>([]);
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [compareLoading, setCompareLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const ITEMS_PER_PAGE = 12;
  
  // Load the Pokemon list
  useEffect(() => {
    const loadPokemonList = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (searchQuery) {
          const searchResults = await searchPokemon(searchQuery);
          setTotalCount(searchResults.count);
          
          // Paginate search results
          const pageResults = searchResults.results.slice(
            (currentPage - 1) * ITEMS_PER_PAGE,
            currentPage * ITEMS_PER_PAGE
          );
          
          // Fetch details for each Pokemon
          const detailedPokemon = await Promise.all(
            pageResults.map(pokemon => fetchPokemon(pokemon.name))
          );
          
          setPokemonList(detailedPokemon);
        } else {
          const offset = (currentPage - 1) * ITEMS_PER_PAGE;
          const response = await fetchPokemonList(ITEMS_PER_PAGE, offset);
          setTotalCount(response.count);
          
          // Fetch details for each Pokemon
          const detailedPokemon = await Promise.all(
            response.results.map(pokemon => fetchPokemon(pokemon.name))
          );
          
          setPokemonList(detailedPokemon);
        }
      } catch (err) {
        setError('Failed to load Pokemon. Please try again later.');
        console.error('Error fetching Pokemon:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadPokemonList();
  }, [currentPage, searchQuery]);
  
  // Load initial Pokemon from URL if provided
  useEffect(() => {
    const loadInitialPokemon = async () => {
      if (initialPokemonId) {
        setCompareLoading(true);
        try {
          const pokemon = await fetchPokemon(initialPokemonId);
          setSelectedPokemon([pokemon]);
        } catch (error) {
          console.error('Failed to load initial Pokemon:', error);
        } finally {
          setCompareLoading(false);
        }
      }
    };
    
    loadInitialPokemon();
  }, [initialPokemonId]);
  
  const handleSelectForCompare = (pokemon: Pokemon) => {
    // Check if Pokemon is already selected
    const alreadySelected = selectedPokemon.some(p => p.id === pokemon.id);
    
    if (alreadySelected) {
      // Remove from selection
      setSelectedPokemon(prev => prev.filter(p => p.id !== pokemon.id));
    } else {
      // Add to selection (max 2)
      if (selectedPokemon.length < 2) {
        setSelectedPokemon(prev => [...prev, pokemon]);
      } else {
        // Replace the second Pokemon
        setSelectedPokemon(prev => [prev[0], pokemon]);
      }
    }
  };
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page on new search
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0); // Scroll to top on page change
  };
  
  const handleClearSelection = () => {
    setSelectedPokemon([]);
  };
  
  // Compare stats to determine which Pokemon is better in each stat
  const comparePokemon = () => {
    if (selectedPokemon.length !== 2) return {};
    
    const [pokemon1, pokemon2] = selectedPokemon;
    const statsComparison: Record<string, boolean> = {};
    
    // This allows for comparison even when one Pokemon is showing a mega form
    // in the detail view, because we still have access to the base Pokemon data
    pokemon1.stats.forEach(stat1 => {
      const stat2 = pokemon2.stats.find(s => s.stat.name === stat1.stat.name);
      if (stat2) {
        // Mark true if pokemon1's stat is better
        statsComparison[stat1.stat.name] = stat1.base_stat > stat2.base_stat;
      }
    });
    
    return {
      pokemon1: statsComparison,
      pokemon2: Object.entries(statsComparison).reduce((acc, [key, value]) => {
        acc[key] = !value;
        return acc;
      }, {} as Record<string, boolean>)
    };
  };
  
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  const statsComparison = selectedPokemon.length === 2 ? comparePokemon() : null;
  
  return (
    <ComparePageContainer>
      <Link to="/">
        <BackButton>← Back to Home</BackButton>
      </Link>
      
      <Heading>Compare Pokemon</Heading>
      <Text>Select up to 2 Pokemon to compare their battle strength. We'll analyze their stats, type advantages, and overall battle potential.</Text>
      
      {selectedPokemon.length > 0 && (
        <>
          <Flex justify="space-between" style={{ marginTop: '24px' }}>
            <Heading>Selected Pokemon</Heading>
            <Button onClick={handleClearSelection}>Clear Selection</Button>
          </Flex>
          
          <CompareContainer>
            {compareLoading ? (
              <LoadingSpinner />
            ) : (
              <>
                {selectedPokemon[0] ? (
                  <PokemonDetailCard 
                    pokemon={selectedPokemon[0]} 
                    showWinner={selectedPokemon.length === 2}
                    isBetter={statsComparison?.pokemon1}
                    opponent={selectedPokemon[1]}
                  />
                ) : (
                  <EmptySlot>
                    <Text>Select a Pokemon to compare</Text>
                  </EmptySlot>
                )}
                
                <VSBox>VS</VSBox>
                
                {selectedPokemon[1] ? (
                  <PokemonDetailCard 
                    pokemon={selectedPokemon[1]} 
                    showWinner={selectedPokemon.length === 2}
                    isBetter={statsComparison?.pokemon2}
                    opponent={selectedPokemon[0]}
                  />
                ) : (
                  <EmptySlot>
                    <Text>Select a Pokemon to compare</Text>
                  </EmptySlot>
                )}
              </>
            )}
          </CompareContainer>
        </>
      )}
      
      <Heading style={{ marginTop: '40px' }}>Choose Pokemon</Heading>
      
      <SearchBar onSearch={handleSearch} />
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {searchQuery && (
            <Text>Found {totalCount} results for "{searchQuery}"</Text>
          )}
          
          <Grid>
            {pokemonList.map(pokemon => (
              <PokemonCard 
                key={pokemon.id}
                pokemon={pokemon}
                onSelectForCompare={handleSelectForCompare}
                isInCompare={selectedPokemon.some(p => p.id === pokemon.id)}
              />
            ))}
          </Grid>
          
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </ComparePageContainer>
  );
};

export default Compare;