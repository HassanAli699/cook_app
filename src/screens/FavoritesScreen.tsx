import React from 'react';
import { Heart, Clock, Star, Tag } from 'lucide-react';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { useFavorites } from '../contexts/FavoritesContext';

interface FavoritesScreenProps {
  onNavigate: (screen: string, data?: any) => void;
}

export function FavoritesScreen({ onNavigate }: FavoritesScreenProps) {
  const { favorites, removeFromFavorites } = useFavorites();

  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      <Header title="My Favorites" onBack={() => onNavigate('settings')} />

      <div className="px-4 py-6">
        {favorites.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="text-6xl mb-4">💝</div>
            <h3 className="mb-2">No Favorites Yet</h3>
            <p className="text-[var(--color-text-secondary)] mb-6">
              Start adding recipes to your favorites to see them here
            </p>
            <button
              onClick={() => onNavigate('recipes')}
              className="text-[var(--color-primary)] hover:underline"
            >
              Browse Recipes
            </button>
          </Card>
        ) : (
          <div className="space-y-4">
            <p className="text-[var(--color-text-secondary)] mb-4">
              {favorites.length} {favorites.length === 1 ? 'recipe' : 'recipes'} saved
            </p>
            {favorites.map((recipe) => (
              <Card key={recipe.id} className="overflow-hidden">
                <div className="flex gap-4">
                  <div 
                    className="w-28 h-28 flex-shrink-0 bg-cover bg-center cursor-pointer"
                    style={{ backgroundImage: `url(${recipe.image})` }}
                    onClick={() => onNavigate('recipe-detail', { recipe })}
                  />
                  <div className="flex-1 py-3 pr-3 flex flex-col justify-between min-w-0">
                    <div>
                      <h4 
                        className="mb-2 line-clamp-2 cursor-pointer hover:text-[var(--color-primary)] transition-colors"
                        onClick={() => onNavigate('recipe-detail', { recipe })}
                      >
                        {recipe.title}
                      </h4>
                      <div className="flex items-center gap-3 text-sm text-[var(--color-text-secondary)] mb-2">
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {recipe.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star size={14} className="fill-yellow-400 text-yellow-400" />
                          {recipe.rating}
                        </span>
                      </div>
                      {recipe.category && (
                        <span className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-[var(--color-sage-green)]/10 text-[var(--color-sage-green)] rounded-full w-fit">
                          <Tag size={10} />
                          {recipe.category}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => removeFromFavorites(recipe.id)}
                      className="flex items-center gap-1 text-sm text-[var(--color-error)] hover:underline w-fit"
                    >
                      <Heart size={14} className="fill-current" />
                      Remove
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
