import React from 'react';
import styled from 'styled-components';
import { Pokemon } from '../types/pokemon';
import { 
  Card, 
  TypeBadge, 
  Flex, 
  Text, 
  StatBar, 
  SubHeading 
} from '../styles/StyledComponents';

interface PokemonDetailCardProps {
  pokemon: Pokemon;
  showWinner?: boolean;
  isBetter?: Record<string, boolean>;
}

const DetailCard = styled(Card)`
  height: 100%;
`;

const PokemonImage = styled.img`
  width: 180px;
  height: 180px;
  margin: 0 auto;
  object-fit: contain;
`;

const PokemonName = styled.h2`
  font-size: 24px;
  font-weight: 700;
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
  justify-content: center;
`;

const StatLabel = styled.span<{ highlight?: boolean }>`
  font-size: 14px;
  color: ${props => props.highlight ? '#48d0b0' : '#555'};
  font-weight: ${props => props.highlight ? '600' : '400'};
  text-transform: capitalize;
`;

const StatValue = styled.span<{ highlight?: boolean }>`
  font-size: 14px;
  color: ${props => props.highlight ? '#48d0b0' : '#333'};
  font-weight: ${props => props.highlight ? '600' : '400'};
`;

const StatsContainer = styled.div`
  margin-top: 20px;
`;

const StatItem = styled.div`
  margin-bottom: 12px;
`;

const PokemonDetailCard: React.FC<PokemonDetailCardProps> = ({
  pokemon,
  showWinner = false,
  isBetter = {}
}) => {
  return (
    <DetailCard>
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
      
      <SubHeading>Basic Info</SubHeading>
      <Flex justify="space-between" gap="16px">
        <Text>Height: {pokemon.height / 10}m</Text>
        <Text>Weight: {pokemon.weight / 10}kg</Text>
        <Text>Base Exp: {pokemon.base_experience}</Text>
      </Flex>
      
      <SubHeading>Abilities</SubHeading>
      <Flex gap="8px" style={{ flexWrap: 'wrap' }}>
        {pokemon.abilities.map(ability => (
          <Text key={ability.ability.name} style={{ textTransform: 'capitalize' }}>
            {ability.ability.name.replace('-', ' ')}
          </Text>
        ))}
      </Flex>
      
      <StatsContainer>
        <SubHeading>Stats</SubHeading>
        
        {pokemon.stats.map(stat => (
          <StatItem key={stat.stat.name}>
            <Flex justify="space-between" align="center">
              <StatLabel highlight={showWinner && isBetter[stat.stat.name]}>
                {stat.stat.name.replace('-', ' ')}
              </StatLabel>
              <StatValue highlight={showWinner && isBetter[stat.stat.name]}>
                {stat.base_stat}
              </StatValue>
            </Flex>
            <StatBar value={stat.base_stat} />
          </StatItem>
        ))}
      </StatsContainer>
    </DetailCard>
  );
};

export default PokemonDetailCard;