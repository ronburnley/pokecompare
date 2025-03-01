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
  opponent?: Pokemon; // Used for type effectiveness comparison
}

const DetailCard = styled(Card)`
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
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

const BattleScoreContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 16px 0;
  background-color: #f8f8f8;
  border-radius: 12px;
  padding: 16px;
  border: 2px solid #e0e0e0;
  min-height: 120px;
  justify-content: center;
`;

const BattleScoreValue = styled.div<{ winner?: boolean }>`
  font-size: 36px;
  font-weight: 700;
  color: ${props => props.winner ? '#48d0b0' : '#333'};
  margin: 8px 0;
`;

const BattleScoreText = styled.div`
  font-size: 14px;
  color: #555;
  text-align: center;
`;

const StatIcon = styled.span<{ better?: boolean, equal?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.better ? '#48d0b0' : props.equal ? '#FFA500' : '#ff5350'};
  margin-left: 8px;
`;

const TypeEffectivenessContainer = styled.div`
  margin: 12px 0;
  padding: 12px;
  background-color: #f0f0f0;
  border-radius: 8px;
  min-height: 100px;
  display: flex;
  flex-direction: column;
`;

const TypeEffectivenessTitle = styled.div`
  font-weight: 600;
  margin-bottom: 8px;
  font-size: 15px;
  color: #333;
`;

const EffectivenessValue = styled.span<{ strong?: boolean, weak?: boolean }>`
  font-weight: ${props => props.strong || props.weak ? '600' : '400'};
  color: ${props => props.strong ? '#48d0b0' : props.weak ? '#ff5350' : '#333'};
`;

const TotalStatsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  margin-top: 12px;
  background-color: #e8f5e9;
  border-radius: 8px;
  border-left: 4px solid #48d0b0;
`;

const TotalStatsValue = styled.span<{ highlight?: boolean }>`
  font-size: 18px;
  font-weight: 700;
  color: ${props => props.highlight ? '#48d0b0' : '#333'};
`;

const StatsContainer = styled.div`
  margin-top: 20px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
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

// Type effectiveness mapping for all Pokémon types
const typeEffectiveness: Record<string, { strong: string[], weak: string[] }> = {
  normal: { 
    strong: [], 
    weak: ['fighting'] 
  },
  fire: { 
    strong: ['grass', 'ice', 'bug', 'steel'], 
    weak: ['water', 'ground', 'rock'] 
  },
  water: { 
    strong: ['fire', 'ground', 'rock'], 
    weak: ['electric', 'grass'] 
  },
  electric: { 
    strong: ['water', 'flying'], 
    weak: ['ground'] 
  },
  grass: { 
    strong: ['water', 'ground', 'rock'], 
    weak: ['fire', 'ice', 'poison', 'flying', 'bug'] 
  },
  ice: { 
    strong: ['grass', 'ground', 'flying', 'dragon'], 
    weak: ['fire', 'fighting', 'rock', 'steel'] 
  },
  fighting: { 
    strong: ['normal', 'ice', 'rock', 'dark', 'steel'], 
    weak: ['flying', 'psychic', 'fairy'] 
  },
  poison: { 
    strong: ['grass', 'fairy'], 
    weak: ['ground', 'psychic'] 
  },
  ground: { 
    strong: ['fire', 'electric', 'poison', 'rock', 'steel'], 
    weak: ['water', 'grass', 'ice'] 
  },
  flying: { 
    strong: ['grass', 'fighting', 'bug'], 
    weak: ['electric', 'ice', 'rock'] 
  },
  psychic: { 
    strong: ['fighting', 'poison'], 
    weak: ['bug', 'ghost', 'dark'] 
  },
  bug: { 
    strong: ['grass', 'psychic', 'dark'], 
    weak: ['fire', 'flying', 'rock'] 
  },
  rock: { 
    strong: ['fire', 'ice', 'flying', 'bug'], 
    weak: ['water', 'grass', 'fighting', 'ground', 'steel'] 
  },
  ghost: { 
    strong: ['psychic', 'ghost'], 
    weak: ['ghost', 'dark'] 
  },
  dragon: { 
    strong: ['dragon'], 
    weak: ['ice', 'dragon', 'fairy'] 
  },
  dark: { 
    strong: ['psychic', 'ghost'], 
    weak: ['fighting', 'bug', 'fairy'] 
  },
  steel: { 
    strong: ['ice', 'rock', 'fairy'], 
    weak: ['fire', 'fighting', 'ground'] 
  },
  fairy: { 
    strong: ['fighting', 'dragon', 'dark'], 
    weak: ['poison', 'steel'] 
  }
};

// All form types extend PokemonBase, which includes all the required props
type PokemonForm = Pokemon | MegaEvolution | GigantamaxForm;

const PokemonDetailCard: React.FC<PokemonDetailCardProps> = ({
  pokemon,
  showWinner = false,
  isBetter = {},
  opponent
}) => {
  const [activePokemon, setActivePokemon] = useState<PokemonForm>(pokemon);
  const [formType, setFormType] = useState<'base' | 'mega' | 'gmax'>('base');
  
  const hasMegaEvolutions = pokemon.mega_evolutions && pokemon.mega_evolutions.length > 0;
  const hasGigantamaxForm = pokemon.gigantamax_form !== undefined;
  const hasAlternateForms = hasMegaEvolutions || hasGigantamaxForm;

  // Calculate battle score (total of all stats)
  const calculateBattleScore = (pokemon: PokemonForm) => {
    return pokemon.stats.reduce((total, stat) => total + stat.base_stat, 0);
  };
  
  const battleScore = calculateBattleScore(activePokemon);
  const isWinner = showWinner && opponent && 
    calculateBattleScore(activePokemon) > calculateBattleScore(opponent);

  // Calculate type effectiveness against opponent
  const getTypeEffectiveness = (pokemon: PokemonForm, opponentPokemon?: Pokemon) => {
    if (!opponentPokemon) return null;
    
    const pokemonTypes = pokemon.types.map(t => t.type.name);
    const opponentTypes = opponentPokemon.types.map(t => t.type.name);
    
    // Check if this Pokemon's types are effective against opponent
    const strongAgainst = pokemonTypes.flatMap(type => 
      typeEffectiveness[type]?.strong.filter(t => opponentTypes.includes(t)) || []
    );
    
    // Check if opponent's types are effective against this Pokemon
    const weakAgainst = pokemonTypes.flatMap(type =>
      opponentTypes.filter(opponentType => 
        typeEffectiveness[opponentType]?.strong.includes(type)
      )
    );
    
    return {
      strongAgainst: Array.from(new Set(strongAgainst)),
      weakAgainst: Array.from(new Set(weakAgainst))
    };
  };
  
  const typeAdvantage = opponent ? getTypeEffectiveness(activePokemon, opponent) : null;
  
  const handleFormChange = (form: PokemonForm, type: 'base' | 'mega' | 'gmax') => {
    setActivePokemon(form);
    setFormType(type);
  };
  
  return (
    <DetailCard>
      <PokemonId>#{activePokemon.id}</PokemonId>
      
      {/* Pokémon image, name and type section */}
      <div style={{ marginBottom: '16px' }}>
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
      </div>
      
      {/* Battle score section - always the same height for alignment */}
      <div style={{ minHeight: showWinner ? 'auto' : '120px' }}>
        {showWinner && (
          <BattleScoreContainer>
            <BattleScoreText>Battle Score</BattleScoreText>
            <BattleScoreValue winner={isWinner}>{battleScore}</BattleScoreValue>
            <BattleScoreText>
              {isWinner ? 'This Pokémon has stronger overall stats' : ''}
            </BattleScoreText>
          </BattleScoreContainer>
        )}
      </div>

      {/* Type effectiveness section - always the same height for alignment */}
      <div style={{ minHeight: (showWinner && opponent) ? 'auto' : '100px' }}>
        {showWinner && opponent && typeAdvantage && (
          <TypeEffectivenessContainer>
            <TypeEffectivenessTitle>Type Matchup:</TypeEffectivenessTitle>
            
            {typeAdvantage.strongAgainst.length > 0 && (
              <Text>
                <EffectivenessValue strong>Strong against: </EffectivenessValue>
                {typeAdvantage.strongAgainst.join(', ')}
              </Text>
            )}
            
            {typeAdvantage.weakAgainst.length > 0 && (
              <Text>
                <EffectivenessValue weak>Weak against: </EffectivenessValue>
                {typeAdvantage.weakAgainst.join(', ')}
              </Text>
            )}
            
            {typeAdvantage.strongAgainst.length === 0 && typeAdvantage.weakAgainst.length === 0 && (
              <Text>No direct type advantages</Text>
            )}
          </TypeEffectivenessContainer>
        )}
      </div>

      {/* Basic info section */}
      <div style={{ marginBottom: '16px' }}>
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
      </div>

      {/* Stats section */}
      <StatsContainer>
        <SubHeading>Stats</SubHeading>
        
        {activePokemon.stats.map(stat => (
          <StatItem key={stat.stat.name}>
            <Flex justify="space-between" align="center">
              <StatLabel highlight={showWinner && isBetter[stat.stat.name]}>
                {stat.stat.name.replace('-', ' ')}
              </StatLabel>
              <Flex align="center">
                <StatValue highlight={showWinner && isBetter[stat.stat.name]}>
                  {stat.base_stat}
                </StatValue>
                {showWinner && (
                  <StatIcon 
                    better={isBetter[stat.stat.name]} 
                    equal={opponent?.stats.find(s => s.stat.name === stat.stat.name)?.base_stat === stat.base_stat}
                  >
                    {isBetter[stat.stat.name] ? 
                      "▲" : 
                      opponent?.stats.find(s => s.stat.name === stat.stat.name)?.base_stat === stat.base_stat ? 
                        "=" : 
                        "▼"
                    }
                  </StatIcon>
                )}
              </Flex>
            </Flex>
            <StatBar value={stat.base_stat} />
          </StatItem>
        ))}

        {/* Total stats always shown at bottom, only highlighted when comparing */}
        <TotalStatsContainer>
          <Text style={{ fontWeight: 600 }}>Total Stats</Text>
          <TotalStatsValue highlight={showWinner && isWinner}>{battleScore}</TotalStatsValue>
        </TotalStatsContainer>
      </StatsContainer>
    </DetailCard>
  );
};

export default PokemonDetailCard;