import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { fetchPokemon } from '../services/pokemonApi';
import { Pokemon } from '../types/pokemon';
import { 
  Container, 
  Heading, 
  Button, 
  LoadingSpinner, 
  ErrorMessage 
} from '../styles/StyledComponents';
import PokemonDetailCard from '../components/PokemonDetailCard';
import { useFavorites } from '../context/FavoritesContext';

const DetailContainer = styled(Container)`
  padding-top: 40px;
  padding-bottom: 40px;
`;

const BackButton = styled(Button)`
  margin-bottom: 20px;
  background-color: #3b5ca8;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 24px;
`;

const PokemonDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  
  useEffect(() => {
    const loadPokemon = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (id) {
          const data = await fetchPokemon(id);
          setPokemon(data);
        }
      } catch (err) {
        setError('Failed to load Pokemon. Please try again later.');
        console.error('Error fetching Pokemon:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadPokemon();
  }, [id]);
  
  const handleFavoriteToggle = () => {
    if (!pokemon) return;
    
    if (isFavorite(pokemon.id)) {
      removeFavorite(pokemon.id);
    } else {
      addFavorite(pokemon);
    }
  };
  
  return (
    <DetailContainer>
      <Link to="/">
        <BackButton>← Back to List</BackButton>
      </Link>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      {loading ? (
        <LoadingSpinner />
      ) : pokemon ? (
        <>
          <Heading>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</Heading>
          
          <PokemonDetailCard pokemon={pokemon} />
          
          <ActionButtons>
            <Button onClick={handleFavoriteToggle}>
              {isFavorite(pokemon.id) ? 'Remove from Favorites' : 'Add to Favorites'}
            </Button>
            
            <Link to={`/compare?pokemon=${pokemon.id}`}>
              <Button style={{ backgroundColor: '#3b5ca8' }}>
                Compare This Pokemon
              </Button>
            </Link>
          </ActionButtons>
        </>
      ) : (
        <ErrorMessage>Pokemon not found</ErrorMessage>
      )}
    </DetailContainer>
  );
};

export default PokemonDetail;