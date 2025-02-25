import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { fetchPokemonList, fetchPokemon, searchPokemon } from '../services/pokemonApi';
import { Pokemon } from '../types/pokemon';
import { 
  Container, 
  Heading, 
  Text, 
  Grid, 
  LoadingSpinner, 
  ErrorMessage 
} from '../styles/StyledComponents';
import PokemonCard from '../components/PokemonCard';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import { useFavorites } from '../context/FavoritesContext';

const HomeContainer = styled(Container)`
  padding-top: 40px;
  padding-bottom: 40px;
`;

const Home: React.FC = () => {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const { addFavorite, isFavorite } = useFavorites();
  
  const ITEMS_PER_PAGE = 20;
  
  useEffect(() => {
    const loadPokemon = async () => {
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
    
    loadPokemon();
  }, [currentPage, searchQuery]);
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page on new search
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0); // Scroll to top on page change
  };
  
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  
  return (
    <HomeContainer>
      <Heading>Pokemon Explorer</Heading>
      <Text>Discover and compare Pokemon from all generations.</Text>
      
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
                onAddToFavorites={addFavorite}
                isFavorite={isFavorite(pokemon.id)}
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
    </HomeContainer>
  );
};

export default Home;