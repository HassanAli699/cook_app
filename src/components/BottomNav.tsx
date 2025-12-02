import React from 'react';
import { Home, BookOpen, Calendar, ShoppingBag, Users } from 'lucide-react';

interface BottomNavProps {
  active: string;
  onNavigate: (screen: string) => void;
}

export function BottomNav({ active, onNavigate }: BottomNavProps) {
  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'recipes', icon: BookOpen, label: 'Recipes' },
    { id: 'planner', icon: Calendar, label: 'Planner' },
    { id: 'grocery', icon: ShoppingBag, label: 'Grocery' },
    { id: 'community', icon: Users, label: 'Community' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[var(--color-surface)] border-t border-[var(--color-border)] z-50 safe-area-bottom">
      <div className="max-w-[428px] mx-auto">
        <div className="grid grid-cols-5 px-2 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all ${
                  isActive 
                    ? 'text-[var(--color-primary)]' 
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-cream)]'
                }`}
              >
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-xs mt-1">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
