import React, { useState } from 'react';
import { ArrowLeft, Crown, Check, X, Sparkles, Lock, Calendar, ShoppingBag, Package, Bell } from 'lucide-react';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';

interface SubscriptionScreenProps {
  onNavigate: (screen: string, params?: any) => void;
}

export function SubscriptionScreen({ onNavigate }: SubscriptionScreenProps) {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly' | 'lifetime'>('yearly');

  const plans = [
    {
      id: 'monthly' as const,
      name: 'Monthly',
      price: '$3.99',
      originalPrice: null,
      period: '/month',
      badge: null,
      savings: null,
      trial: '3 months free'
    },
    {
      id: 'yearly' as const,
      name: 'Yearly',
      price: '$35.99',
      originalPrice: '$47.88',
      period: '/year',
      badge: 'Most Popular',
      savings: 'Save 25%',
      trial: '3 months free'
    },
    {
      id: 'lifetime' as const,
      name: 'Lifetime',
      price: '$69.99',
      originalPrice: '$99.99',
      period: 'one-time',
      badge: 'Best Value',
      savings: 'Save 30%',
      trial: 'No trial needed'
    }
  ];

  const features = [
    { name: 'AI Recipe Suggestions', free: 'Basic', premium: 'Unlimited + Advanced' },
    { name: 'Cooking Assistant', free: 'Step-by-Step', premium: 'Voice Mode + Smart Timers' },
    { name: 'Meal Planner', free: 'Manual Planning', premium: 'AI Auto-Generation' },
    { name: 'Inventory Tracking', free: 'Basic Tracking', premium: 'AI Predictions + Scanning' },
    { name: 'Grocery Manager', free: 'Simple Lists', premium: 'Smart Lists + Sharing' },
    { name: 'Community Tools', free: 'View Only', premium: 'Post + Creator Badge' },
    { name: 'Notifications', free: 'Limited', premium: 'Priority + Custom' }
  ];

  const handleContinue = () => {
    const plan = plans.find(p => p.id === selectedPlan);
    onNavigate('checkout', { plan });
  };

  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      {/* Header */}
      <div className="bg-gradient-to-br from-[var(--color-premium-gold)] to-[var(--color-premium-gold-dark)] px-6 pt-12 pb-20 rounded-b-3xl shadow-lg relative">
        <button
          onClick={() => onNavigate('home')}
          className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
        >
          <ArrowLeft size={20} className="text-white" />
        </button>

        <div className="text-center text-white">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm mb-4">
            <Crown size={40} className="text-white" />
          </div>
          <h1 className="text-white mb-2">Go Premium</h1>
          <p className="text-white/90">
            Unlock the full Smart Chef experience
          </p>
        </div>
      </div>

      <div className="px-4 -mt-12 pb-6 space-y-6">
        {/* Trial Notice Banner */}
        <Card className="p-4 bg-gradient-to-r from-green-500 to-green-600 border-2 border-green-400 shadow-xl">
          <div className="text-center text-white">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Sparkles size={20} />
              <h3 className="text-white mb-0">Limited Time Offer!</h3>
              <Sparkles size={20} />
            </div>
            <p className="text-white/95 text-sm">
              Get 3 months FREE when you start your Premium subscription today
            </p>
          </div>
        </Card>

        {/* Pricing Cards */}
        <div className="space-y-3">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`p-5 cursor-pointer transition-all ${
                selectedPlan === plan.id
                  ? 'border-4 border-[var(--color-premium-gold)] shadow-lg scale-[1.02]'
                  : 'border-2 border-transparent'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3>{plan.name}</h3>
                    {plan.badge && (
                      <span className="bg-[var(--color-premium-gold)] text-white px-2 py-1 rounded text-xs">
                        {plan.badge}
                      </span>
                    )}
                  </div>
                  
                  {/* Trial Badge */}
                  {plan.id !== 'lifetime' && (
                    <div className="inline-block bg-green-500 text-white px-2 py-1 rounded text-xs mb-2">
                      🎉 {plan.trial}
                    </div>
                  )}
                  
                  <div className="flex items-baseline gap-2 mb-1">
                    {plan.originalPrice && (
                      <span className="text-sm text-[var(--color-text-secondary)] line-through">
                        {plan.originalPrice}
                      </span>
                    )}
                    <span className="text-2xl">{plan.price}</span>
                    <span className="text-sm text-[var(--color-text-secondary)]">{plan.period}</span>
                  </div>
                  
                  {plan.id !== 'lifetime' && (
                    <p className="text-xs text-[var(--color-text-secondary)] mb-1">
                      After 3-month free trial
                    </p>
                  )}
                  
                  {plan.savings && (
                    <span className="text-sm text-green-600 font-semibold">{plan.savings}</span>
                  )}
                </div>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedPlan === plan.id
                      ? 'bg-[var(--color-premium-gold)] border-[var(--color-premium-gold)]'
                      : 'border-[var(--color-border)]'
                  }`}
                >
                  {selectedPlan === plan.id && <Check size={16} className="text-white" />}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Features Comparison */}
        <Card className="p-6">
          <h3 className="mb-4">What's Included</h3>
          <div className="space-y-4">
            {features.map((feature, index) => (
              <div key={index} className="space-y-2">
                <h4 className="text-sm">{feature.name}</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[var(--color-cream)] rounded-lg p-3">
                    <p className="text-xs text-[var(--color-text-secondary)] mb-1">Free</p>
                    <p className="text-sm">{feature.free}</p>
                  </div>
                  <div className="bg-gradient-to-br from-[var(--color-premium-gold)]/10 to-[var(--color-premium-gold)]/5 rounded-lg p-3 border border-[var(--color-premium-gold)]/20">
                    <p className="text-xs text-[var(--color-premium-gold)] mb-1 flex items-center gap-1">
                      <Crown size={12} />
                      Premium
                    </p>
                    <p className="text-sm">{feature.premium}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Premium Benefits List */}
        <Card className="p-6 bg-gradient-to-br from-[var(--color-premium-gold)]/5 to-[var(--color-premium-gold)]/10">
          <h3 className="mb-4">Premium Benefits</h3>
          <div className="space-y-3">
            {[
              'Unlimited AI-powered recipe suggestions',
              'Voice-activated cooking assistant',
              'Auto-generate weekly meal plans',
              'Smart inventory with barcode scanning',
              'Shared grocery lists with family',
              'Priority customer support',
              'Ad-free experience',
              'Early access to new features'
            ].map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[var(--color-premium-gold)] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check size={16} className="text-white" />
                </div>
                <p className="text-[var(--color-text-primary)]">{benefit}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* CTA Button */}
        <Button
          onClick={handleContinue}
          size="lg"
          className="w-full bg-gradient-to-r from-[var(--color-premium-gold)] to-[var(--color-premium-gold-dark)] text-white border-none shadow-xl hover:opacity-90"
        >
          <Crown size={20} />
          GO PREMIUM
        </Button>

        {/* Go Basic Button */}
        <Button
          onClick={() => onNavigate('home')}
          variant="outline"
          size="lg"
          className="w-full"
        >
          GO BASIC
        </Button>

        {/* Terms */}
        <p className="text-xs text-center text-[var(--color-text-secondary)]">
          Auto-renews unless cancelled. Terms and conditions apply.
        </p>
      </div>
    </div>
  );
}