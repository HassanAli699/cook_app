import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Recipe {
  id: string;
  title: string;
  image: string;
  time: string;
  rating: string;
  category?: string;
  isPremium?: boolean;
}

interface FavoritesContextType {
  favorites: Recipe[];
  addToFavorites: (recipe: Recipe) => void;
  removeFromFavorites: (recipeId: string) => void;
  isFavorite: (recipeId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Recipe[]>(() => {
    // TODO: Fetch user's favorites from backend on mount
    // Example:
    // const fetchFavorites = async () => {
    //   try {
    //     const authToken = localStorage.getItem('authToken');
    //     const result = await api.get('/user/favorites', {
    //       headers: { 'Authorization': `Bearer ${authToken}` }
    //     });
    //     return result.data.favorites || [];
    //   } catch (error) {
    //     console.error('Failed to fetch favorites:', error);
    //     return [];
    //   }
    // };
    
    // TEMPORARY: Empty array until backend is connected
    return [];
  });

  const addToFavorites = (recipe: Recipe) => {
    setFavorites((prev) => {
      // Don't add if already exists
      if (prev.some((fav) => fav.id === recipe.id)) {
        return prev;
      }
      
      const newFavorites = [...prev, recipe];
      
      // TODO: Sync add to favorites with backend
      // Example:
      // try {
      //   const authToken = localStorage.getItem('authToken');
      //   await api.post('/user/favorites',
      //     { recipeId: recipe.id },
      //     { headers: { 'Authorization': `Bearer ${authToken}` } }
      //   );
      // } catch (error) {
      //   console.error('Failed to add to favorites:', error);
      //   // Optionally rollback the state change
      // }
      
      return newFavorites;
    });
  };

  const removeFromFavorites = (recipeId: string) => {
    setFavorites((prev) => {
      const newFavorites = prev.filter((recipe) => recipe.id !== recipeId);
      
      // TODO: Sync remove from favorites with backend
      // Example:
      // try {
      //   const authToken = localStorage.getItem('authToken');
      //   await api.delete(`/user/favorites/${recipeId}`, {
      //     headers: { 'Authorization': `Bearer ${authToken}` }
      //   });
      // } catch (error) {
      //   console.error('Failed to remove from favorites:', error);
      //   // Optionally rollback the state change
      // }
      
      return newFavorites;
    });
  };

  const isFavorite = (recipeId: string) => {
    return favorites.some((recipe) => recipe.id === recipeId);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addToFavorites, removeFromFavorites, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}