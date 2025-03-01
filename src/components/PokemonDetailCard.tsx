import React, { useState } from 'react';
import styled from 'styled-components';
import { Pokemon, MegaEvolution, GigantamaxForm } from '../types/pokemon';
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

const MegaEvolutionTabsContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  flex-wrap: wrap;
  gap: 8px;
`;

const MegaEvolutionTab = styled.button<{ active: boolean }>`
  padding: 8px 16px;
  border-radius: 16px;
  background-color: ${props => props.active ? '#3b5ca8' : '#f0f0f0'};
  color: ${props => props.active ? 'white' : '#555'};
  font-weight: ${props => props.active ? '600' : '400'};
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  
  &:hover {
    background-color: ${props => props.active ? '#3b5ca8' : '#e0e0e0'};
  }
`;

const MegaIndicator = styled.div`
  text-align: center;
  padding: 8px;
  margin-top: 16px;
  font-weight: 600;
  color: #7038F8;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:before,
  &:after {
    content: '';
    height: 2px;
    width: 40px;
    background-color: #7038F8;
    margin: 0 12px;
  }
`;

const GigantamaxIndicator = styled.div`
  text-align: center;
  padding: 8px;
  margin-top: 16px;
  font-weight: 600;
  color: #FF5350;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:before,
  &:after {
    content: '';
    height: 2px;
    width: 40px;
    background-color: #FF5350;
    margin: 0 12px;
  }
`;

// All form types extend PokemonBase, which includes all the required props
type PokemonForm = Pokemon | MegaEvolution | GigantamaxForm;

const PokemonDetailCard: React.FC<PokemonDetailCardProps> = ({
  pokemon,
  showWinner = false,
  isBetter = {}
}) => {
  const [activePokemon, setActivePokemon] = useState<PokemonForm>(pokemon);
  const [formType, setFormType] = useState<'base' | 'mega' | 'gmax'>('base');
  
  const hasMegaEvolutions = pokemon.mega_evolutions && pokemon.mega_evolutions.length > 0;
  const hasGigantamaxForm = pokemon.gigantamax_form !== undefined;
  const hasAlternateForms = hasMegaEvolutions || hasGigantamaxForm;
  
  const handleFormChange = (form: PokemonForm, type: 'base' | 'mega' | 'gmax') => {
    setActivePokemon(form);
    setFormType(type);
  };
  
  return (
    <DetailCard>
      <PokemonId>#{activePokemon.id}</PokemonId>
      
      {hasAlternateForms && (
        <MegaEvolutionTabsContainer>
          <MegaEvolutionTab 
            active={formType === 'base'} 
            onClick={() => handleFormChange(pokemon, 'base')}
          >
            Base Form
          </MegaEvolutionTab>
          
          {pokemon.mega_evolutions?.map((mega, index) => (
            <MegaEvolutionTab 
              key={mega.name}
              active={formType === 'mega' && activePokemon.name === mega.name} 
              onClick={() => handleFormChange(mega, 'mega')}
            >
              {pokemon.mega_evolutions!.length > 1 
                ? `Mega Form ${String.fromCharCode(65 + index)}` // A, B, C, etc.
                : "Mega Form"
              }
            </MegaEvolutionTab>
          ))}
          
          {pokemon.gigantamax_form && (
            <MegaEvolutionTab
              active={formType === 'gmax'}
              onClick={() => handleFormChange(pokemon.gigantamax_form!, 'gmax')}
            >
              Gigantamax
            </MegaEvolutionTab>
          )}
        </MegaEvolutionTabsContainer>
      )}
      
      <PokemonImage 
        src={activePokemon.sprites.other['official-artwork'].front_default || activePokemon.sprites.front_default} 
        alt={activePokemon.name} 
      />
      
      <PokemonName>
        {formType === 'base' 
          ? activePokemon.name 
          : activePokemon.name.split('-').slice(0, -1).join(' ')}
      </PokemonName>
      
      {formType === 'mega' && <MegaIndicator>Mega Evolution</MegaIndicator>}
      {formType === 'gmax' && <GigantamaxIndicator>Gigantamax Form</GigantamaxIndicator>}
      
      <TypesContainer>
        {activePokemon.types.map(typeInfo => (
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
        <Text>Height: {activePokemon.height / 10}m</Text>
        <Text>Weight: {activePokemon.weight / 10}kg</Text>
        <Text>Base Exp: {activePokemon.base_experience}</Text>
      </Flex>
      
      <SubHeading>Abilities</SubHeading>
      <Flex gap="8px" style={{ flexWrap: 'wrap' }}>
        {activePokemon.abilities.map(ability => (
          <Text key={ability.ability.name} style={{ textTransform: 'capitalize' }}>
            {ability.ability.name.replace('-', ' ')}
          </Text>
        ))}
      </Flex>
      
      <StatsContainer>
        <SubHeading>Stats</SubHeading>
        
        {activePokemon.stats.map(stat => (
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