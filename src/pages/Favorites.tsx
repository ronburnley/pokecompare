import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { 
  Container, 
  Heading, 
  Text, 
  Grid, 
  Button
} from '../styles/StyledComponents';
import PokemonCard from '../components/PokemonCard';
import { useFavorites } from '../context/FavoritesContext';

const FavoritesContainer = styled(Container)`
  padding-top: 40px;
  padding-bottom: 40px;
`;

const BackButton = styled(Button)`
  margin-bottom: 20px;
  background-color: #3b5ca8;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 60px 0;
  text-align: center;
`;

const Favorites: React.FC = () => {
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites();
  
  const handleToggleFavorite = (pokemon: any) => {
    if (isFavorite(pokemon.id)) {
      removeFavorite(pokemon.id);
    } else {
      addFavorite(pokemon);
    }
  };
  
  return (
    <FavoritesContainer>
      <Link to="/">
        <BackButton>← Back to Home</BackButton>
      </Link>
      
      <Heading>Your Favorite Pokemon</Heading>
      <Text>Manage your collection of favorite Pokemon.</Text>
      
      {favorites.length === 0 ? (
        <EmptyState>
          <Text style={{ fontSize: '18px', marginBottom: '20px' }}>
            You don't have any favorite Pokemon yet.
          </Text>
          <Link to="/">
            <Button>Browse Pokemon</Button>
          </Link>
        </EmptyState>
      ) : (
        <Grid>
          {favorites.map(pokemon => (
            <PokemonCard 
              key={pokemon.id}
              pokemon={pokemon}
              onAddToFavorites={handleToggleFavorite}
              isFavorite={true}
            />
          ))}
        </Grid>
      )}
    </FavoritesContainer>
  );
};

export default Favorites;