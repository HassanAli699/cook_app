import React, { useState } from 'react';
import { Button } from '../components/Button';
import { Logo } from '../components/Logo';

interface OnboardingSlide {
  title: string;
  description: string;
  icon: string;
  image: string;
}

const slides: OnboardingSlide[] = [
  {
    title: 'Welcome to Smart Chef',
    description: 'Your AI-powered cooking companion for discovering recipes, planning meals, and mastering the kitchen.',
    icon: '🍳',
    image: 'https://images.unsplash.com/photo-1564965925873-26de794b0d41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb29raW5nJTIwaW5ncmVkaWVudHMlMjBzcGljZXN8ZW58MXx8fHwxNzY0MDc3MTEyfDA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    title: 'AI Recipe Engine',
    description: 'Discover personalized recipes based on your preferences, dietary needs, and available ingredients.',
    icon: '📖',
    image: 'https://images.unsplash.com/photo-1709433420444-0535a5f616b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmlsbGVkJTIwYmVlZiUyMHN0ZWFrJTIwaGVyYnN8ZW58MXx8fHwxNzY0MTQ1MzcxfDA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    title: 'Cooking Assistant',
    description: 'Step-by-step guidance with voice commands, smart timers, and hands-free mode.',
    icon: '✨',
    image: 'https://images.unsplash.com/photo-1758874960025-85d40fde6252?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb29raW5nJTIwc21hcnRwaG9uZSUyMHJlY2lwZSUyMGRpZ2l0YWx8ZW58MXx8fHwxNzY0NDQ3MjczfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    title: 'Smart Meal Planner',
    description: 'Plan your weekly meals with AI-powered nutrition tracking and goal-based suggestions.',
    icon: '📅',
    image: 'https://images.unsplash.com/photo-1648521769638-ca9fc1ac698c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWFsJTIwcGxhbm5pbmclMjBub3RlYm9va3xlbnwxfHx8fDE3NjQwNjQyMzl8MA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    title: 'Grocery Manager',
    description: 'Smart shopping lists with auto-generation from meal plans and shared family lists.',
    icon: '🛒',
    image: 'https://images.unsplash.com/photo-1604742763104-86a0cf0aa1c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncm9jZXJ5JTIwc2hvcHBpbmclMjBiYXNrZXR8ZW58MXx8fHwxNzY0MTQ1Mzc0fDA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    title: 'Inventory Tracker',
    description: 'Track pantry items with expiry predictions, barcode scanning, and smart reminders.',
    icon: '📦',
    image: 'https://images.unsplash.com/photo-1620381856261-91ce3d1f0784?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYW50cnklMjBzdG9yYWdlJTIwamFyc3xlbnwxfHx8fDE3NjQxNDUzNzZ8MA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    title: 'Community Platform',
    description: 'Share recipes, connect with food lovers, and discover trending dishes from around the world.',
    icon: '👥',
    image: 'https://images.unsplash.com/photo-1581954548218-415cd6ee5f4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZW9wbGUlMjBzaGFyaW5nJTIwZm9vZCUyMHRhYmxlfGVufDF8fHx8MTc2NDQ0NzI3Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  }
];

interface OnboardingFlowProps {
  onComplete: () => void;
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex === slides.length - 1) {
      onComplete();
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const slide = slides[currentIndex];
  const isLastSlide = currentIndex === slides.length - 1;

  return (
    <div className="relative min-h-screen bg-[var(--color-text-primary)] overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${slide.image})` }}
      >
        {/* Strategic gradient - darker at top/bottom, lighter in middle to show image */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/75" />
        {/* Subtle warm tint */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/5 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col justify-between p-6 animate-fade-in">
        {/* Top Bar with Logo and Skip */}
        <div className="flex justify-between items-center pt-4">
          <div className="animate-slide-up">
            <Logo size="md" variant="light" />
          </div>
          {!isLastSlide && (
            <button
              onClick={handleSkip}
              className="text-white hover:text-white/90 transition-colors px-5 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/30 hover:bg-black/50 shadow-lg"
            >
              Skip
            </button>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4 mt-20">
          {/* Icon with enhanced backdrop */}
          <div className="inline-flex items-center justify-center w-28 h-28 rounded-full bg-black/40 backdrop-blur-xl mb-8 animate-slide-up shadow-2xl border border-white/30">
            <span className="text-6xl drop-shadow-2xl">{slide.icon}</span>
          </div>
          
          {/* Content Card with strong backdrop blur for text readability */}
          <div className="bg-black/50 backdrop-blur-xl rounded-3xl px-8 py-10 border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.4)] max-w-lg mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <h1 className="text-white mb-5 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
              {slide.title}
            </h1>
            
            <p className="text-white text-lg leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              {slide.description}
            </p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pb-8 space-y-6">
          {/* Progress Indicators with backdrop */}
          <div className="flex justify-center gap-2 mb-2 bg-black/30 backdrop-blur-md rounded-full px-6 py-3 inline-flex mx-auto border border-white/20">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer hover:bg-white/80 ${
                  index === currentIndex 
                    ? 'w-10 bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)]' 
                    : 'w-2.5 bg-white/50'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* CTA Button */}
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleNext}
            className="shadow-[0_8px_32px_rgba(232,92,60,0.6)] hover:shadow-[0_8px_40px_rgba(232,92,60,0.8)] transition-all duration-300 backdrop-blur-sm"
          >
            {isLastSlide ? 'Get Started' : 'Continue'}
            <span className="ml-2">→</span>
          </Button>
        </div>
      </div>
    </div>
  );
}