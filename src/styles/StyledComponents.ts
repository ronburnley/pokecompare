import styled from 'styled-components';

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

export const Button = styled.button`
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  transition: all 0.2s ease;
  background-color: #ff5350; /* Pokemon red */
  color: white;
  
  &:hover {
    background-color: #e63e3a;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

export const Card = styled.div`
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 24px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
  }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 24px;
  margin-top: 24px;
`;

export const Flex = styled.div<{ direction?: string; align?: string; justify?: string; gap?: string }>`
  display: flex;
  flex-direction: ${props => props.direction || 'row'};
  align-items: ${props => props.align || 'center'};
  justify-content: ${props => props.justify || 'flex-start'};
  gap: ${props => props.gap || '0'};
`;

export const Input = styled.input`
  padding: 12px 16px;
  border: 2px solid #e1e1e1;
  border-radius: 8px;
  font-size: 16px;
  width: 100%;
  transition: border-color 0.2s ease;
  
  &:focus {
    border-color: #3b5ca8; /* Pokemon blue */
    outline: none;
  }
`;

export const Select = styled.select`
  padding: 12px 16px;
  border: 2px solid #e1e1e1;
  border-radius: 8px;
  font-size: 16px;
  width: 100%;
  transition: border-color 0.2s ease;
  cursor: pointer;
  
  &:focus {
    border-color: #3b5ca8; /* Pokemon blue */
    outline: none;
  }
`;

// Pokemon Type Badges
const typeColors = {
  normal: '#A8A878',
  fire: '#F08030',
  water: '#6890F0',
  electric: '#F8D030',
  grass: '#78C850',
  ice: '#98D8D8',
  fighting: '#C03028',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A890F0',
  psychic: '#F85888',
  bug: '#A8B820',
  rock: '#B8A038',
  ghost: '#705898',
  dragon: '#7038F8',
  dark: '#705848',
  steel: '#B8B8D0',
  fairy: '#EE99AC'
};

export const TypeBadge = styled.span<{ type: keyof typeof typeColors }>`
  background-color: ${props => typeColors[props.type] || '#999'};
  color: white;
  font-size: 14px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 16px;
  text-transform: capitalize;
  display: inline-block;
  margin-right: 8px;
  margin-bottom: 8px;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
`;

export const Heading = styled.h1`
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 16px;
  color: #333;
`;

export const SubHeading = styled.h2`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #444;
`;

export const Text = styled.p`
  font-size: 16px;
  line-height: 1.5;
  margin-bottom: 8px;
  color: #555;
`;

export const CompareContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 80px 1fr;
  gap: 16px;
  margin-top: 32px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const StatBar = styled.div<{ value: number, max?: number }>`
  height: 8px;
  width: 100%;
  background-color: #e1e1e1;
  border-radius: 4px;
  position: relative;
  overflow: hidden;
  
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${props => `${(props.value / (props.max || 255)) * 100}%`};
    background-color: ${props => {
      const percentage = (props.value / (props.max || 255)) * 100;
      if (percentage < 30) return '#ff5350'; // Low - red
      if (percentage < 60) return '#ffae00'; // Medium - orange
      return '#48d0b0'; // High - green
    }};
    border-radius: 4px;
    transition: width 0.5s ease;
  }
`;

export const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #ff5350;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 40px auto;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export const ErrorMessage = styled.div`
  color: #ff5350;
  background-color: #ffeceb;
  padding: 16px;
  border-radius: 8px;
  margin: 16px 0;
  border: 1px solid #ffcccb;
`;