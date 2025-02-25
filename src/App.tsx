import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import GlobalStyles from './styles/GlobalStyles';

// Pages
import Home from './pages/Home';
import PokemonDetail from './pages/PokemonDetail';
import Compare from './pages/Compare';
import Favorites from './pages/Favorites';

// Components
import Header from './components/Header';

// Context
import { FavoritesProvider } from './context/FavoritesContext';

// Theme
const theme = {
  colors: {
    primary: '#ff5350', // Pokemon red
    secondary: '#3b5ca8', // Pokemon blue
    accent: '#ffae00', // Pokemon yellow
    success: '#48d0b0', // Pokemon green
    background: '#f5f5f5',
    text: '#333',
    lightText: '#555'
  },
  breakpoints: {
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px'
  }
};

function App() {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <FavoritesProvider>
          <GlobalStyles />
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pokemon/:id" element={<PokemonDetail />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/favorites" element={<Favorites />} />
          </Routes>
        </FavoritesProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
