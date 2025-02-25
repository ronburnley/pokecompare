import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Pokemon } from '../types/pokemon';

interface FavoritesContextType {
  favorites: Pokemon[];
  addFavorite: (pokemon: Pokemon) => void;
  removeFavorite: (pokemonId: number) => void;
  isFavorite: (pokemonId: number) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  const [favorites, setFavorites] = useState<Pokemon[]>([]);

  // Load favorites from localStorage on initial render
  useEffect(() => {
    const storedFavorites = localStorage.getItem('pokemonFavorites');
    if (storedFavorites) {
      try {
        const parsedFavorites = JSON.parse(storedFavorites);
        setFavorites(parsedFavorites);
      } catch (error) {
        console.error('Failed to parse favorites from localStorage', error);
        localStorage.removeItem('pokemonFavorites');
      }
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('pokemonFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (pokemon: Pokemon) => {
    setFavorites(prevFavorites => {
      // Check if pokemon is already in favorites
      if (prevFavorites.some(fav => fav.id === pokemon.id)) {
        return prevFavorites;
      }
      return [...prevFavorites, pokemon];
    });
  };

  const removeFavorite = (pokemonId: number) => {
    setFavorites(prevFavorites => 
      prevFavorites.filter(pokemon => pokemon.id !== pokemonId)
    );
  };

  const isFavorite = (pokemonId: number) => {
    return favorites.some(pokemon => pokemon.id === pokemonId);
  };

  const value = {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};