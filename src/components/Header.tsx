import React from 'react';
import { ArrowLeft, Settings, Search, MoreVertical } from 'lucide-react';

interface HeaderProps {
  title?: string;
  onBack?: () => void;
  onSettings?: () => void;
  onSearch?: () => void;
  actions?: React.ReactNode;
  transparent?: boolean;
}

export function Header({ 
  title, 
  onBack, 
  onSettings, 
  onSearch, 
  actions,
  transparent = false 
}: HeaderProps) {
  return (
    <div className={`sticky top-0 left-0 right-0 z-40 ${transparent ? 'bg-transparent' : 'bg-[var(--color-surface)] border-b border-[var(--color-border)]'}`}>
      <div className="max-w-[428px] mx-auto">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 -ml-2 rounded-lg hover:bg-[var(--color-cream)] transition-colors"
              >
                <ArrowLeft size={24} className="text-[var(--color-text-primary)]" />
              </button>
            )}
            {title && <h3 className="text-[var(--color-text-primary)]">{title}</h3>}
          </div>
          
          <div className="flex items-center gap-2">
            {onSearch && (
              <button
                onClick={onSearch}
                className="p-2 rounded-lg hover:bg-[var(--color-cream)] transition-colors"
              >
                <Search size={20} className="text-[var(--color-text-primary)]" />
              </button>
            )}
            {onSettings && (
              <button
                onClick={onSettings}
                className="p-2 rounded-lg hover:bg-[var(--color-cream)] transition-colors"
              >
                <Settings size={20} className="text-[var(--color-text-primary)]" />
              </button>
            )}
            {actions}
          </div>
        </div>
      </div>
    </div>
  );
}
