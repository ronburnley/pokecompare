import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Pokemon } from '../types/pokemon';
import { Card, TypeBadge, Flex, Text, Button } from '../styles/StyledComponents';

interface PokemonCardProps {
  pokemon: Pokemon;
  onSelectForCompare?: (pokemon: Pokemon) => void;
  isInCompare?: boolean;
  onAddToFavorites?: (pokemon: Pokemon) => void;
  isFavorite?: boolean;
}

const StyledCard = styled(Card)`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const PokemonImage = styled.img`
  width: 120px;
  height: 120px;
  margin: 0 auto;
  object-fit: contain;
`;

const PokemonName = styled.h3`
  font-size: 20px;
  font-weight: 600;
  margin: 16px 0;
  text-transform: capitalize;
  color: #333;
  text-align: center;
`;

const PokemonId = styled.span`
  color: #888;
  font-size: 14px;
  position: absolute;
  top: 12px;
  right: 12px;
`;

const TypesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 8px 0 16px;
`;

const CardFooter = styled.div`
  margin-top: auto;
  display: flex;
  gap: 8px;
`;

const PokemonCard: React.FC<PokemonCardProps> = ({
  pokemon,
  onSelectForCompare,
  isInCompare = false,
  onAddToFavorites,
  isFavorite = false
}) => {
  const handleCompareClick = () => {
    if (onSelectForCompare) {
      onSelectForCompare(pokemon);
    }
  };

  const handleFavoriteClick = () => {
    if (onAddToFavorites) {
      onAddToFavorites(pokemon);
    }
  };

  return (
    <StyledCard>
      <PokemonId>#{pokemon.id}</PokemonId>
      <PokemonImage 
        src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default} 
        alt={pokemon.name} 
      />
      <PokemonName>{pokemon.name}</PokemonName>
      
      <TypesContainer>
        {pokemon.types.map(typeInfo => (
          <TypeBadge 
            key={typeInfo.type.name} 
            type={typeInfo.type.name as any}
          >
            {typeInfo.type.name}
          </TypeBadge>
        ))}
      </TypesContainer>
      
      <Flex gap="8px">
        <Text>Height: {pokemon.height / 10}m</Text>
        <Text>Weight: {pokemon.weight / 10}kg</Text>
      </Flex>
      
      <CardFooter>
        <Link to={`/pokemon/${pokemon.id}`} style={{ flex: 1 }}>
          <Button style={{ width: '100%' }}>View Details</Button>
        </Link>
        
        {onSelectForCompare && (
          <Button 
            onClick={handleCompareClick}
            style={{ 
              backgroundColor: isInCompare ? '#48d0b0' : '#3b5ca8',
              width: onAddToFavorites ? 'auto' : '100%'
            }}
          >
            {isInCompare ? 'Selected' : 'Compare'}
          </Button>
        )}
        
        {onAddToFavorites && (
          <Button 
            onClick={handleFavoriteClick}
            style={{ backgroundColor: isFavorite ? '#ffae00' : '#888' }}
          >
            {isFavorite ? '★' : '☆'}
          </Button>
        )}
      </CardFooter>
    </StyledCard>
  );
};

export default PokemonCard;