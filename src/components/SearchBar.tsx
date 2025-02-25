import React, { useState } from 'react';
import styled from 'styled-components';
import { Input, Button } from '../styles/StyledComponents';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const SearchContainer = styled.div`
  margin: 20px 0;
  width: 100%;
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

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  placeholder = 'Search Pokémon...' 
}) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <SearchContainer>
      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <SearchWrapper>
          <SearchInput
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
          />
          <SearchButton type="submit">Search</SearchButton>
        </SearchWrapper>
      </form>
    </SearchContainer>
  );
};

export default SearchBar;