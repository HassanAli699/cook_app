import React from 'react';
import { Info, Heart, Users, Sparkles, Target, Award, Mail, Globe, Facebook, Twitter, Instagram } from 'lucide-react';
import { Header } from '../../components/Header';
import { Card } from '../../components/Card';
import { Logo } from '../../components/Logo';

interface AboutScreenProps {
  onNavigate: (screen: string) => void;
}

export function AboutScreen({ onNavigate }: AboutScreenProps) {
  const appVersion = '1.0.0';
  const buildNumber = '2025.11.29';

  const features = [
    { icon: Sparkles, title: '10,000+ Recipes', description: 'Curated collection of delicious recipes' },
    { icon: Users, title: 'Active Community', description: '50,000+ cooking enthusiasts worldwide' },
    { icon: Award, title: 'Premium Features', description: 'Advanced tools for serious home cooks' },
    { icon: Heart, title: 'Made with Love', description: 'Crafted by passionate food lovers' }
  ];



  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      <Header title="About Smart Chef" onBack={() => onNavigate('settings')} />

      <div className="px-4 py-6 space-y-6 pb-20">
        {/* App Logo & Version */}
        <Card className="p-8 text-center">
          <div className="mb-4">
            <Logo size="xl" showText={false} />
          </div>
          <h2 className="mb-2">Smart Chef</h2>
          <p className="text-[var(--color-text-secondary)] mb-1">
            Your Culinary Companion
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-[var(--color-text-secondary)]">
            <span>Version {appVersion}</span>
            <span>•</span>
            <span>Build {buildNumber}</span>
          </div>
        </Card>

        {/* Mission Statement */}
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center flex-shrink-0">
              <Target size={24} className="text-[var(--color-primary)]" />
            </div>
            <div className="flex-1">
              <h4 className="mb-3">Our Mission</h4>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                Smart Chef was created to make cooking accessible, enjoyable, and rewarding for everyone. Whether you're a beginner learning the basics or an experienced chef exploring new cuisines, we're here to inspire your culinary journey.
              </p>
            </div>
          </div>
        </Card>

        {/* What We Believe */}
        <Card className="p-6">
          <h4 className="mb-4">What We Believe</h4>
          <div className="space-y-4">
            <div className="flex gap-3">
              <Heart size={20} className="text-[var(--color-primary)] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium mb-1">Cooking is for Everyone</p>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Everyone deserves access to great recipes and the confidence to create delicious meals.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Users size={20} className="text-[var(--color-primary)] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium mb-1">Community Matters</p>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Sharing recipes and experiences builds connections and makes cooking more fun.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Sparkles size={20} className="text-[var(--color-primary)] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium mb-1">Innovation in the Kitchen</p>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Technology can enhance the cooking experience without losing the joy of hands-on creation.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Award size={20} className="text-[var(--color-primary)] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium mb-1">Quality Over Quantity</p>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Every recipe is carefully curated and tested to ensure great results.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* App Features Overview */}
        <Card className="p-6">
          <h4 className="mb-4">What Smart Chef Offers</h4>
          <div className="grid grid-cols-2 gap-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-secondary)]/10 flex items-center justify-center mx-auto mb-2">
                    <Icon size={20} className="text-[var(--color-primary)]" />
                  </div>
                  <p className="font-medium text-sm mb-1">{feature.title}</p>
                  <p className="text-xs text-[var(--color-text-secondary)]">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Key Features List */}
        <Card className="p-6">
          <h4 className="mb-4">Core Features</h4>
          <div className="space-y-3 text-sm text-[var(--color-text-secondary)]">
            <div className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] mt-2 flex-shrink-0" />
              <p><span className="font-medium text-[var(--color-text-primary)]">Recipe Discovery:</span> Browse thousands of recipes by cuisine, dietary preference, and difficulty level</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] mt-2 flex-shrink-0" />
              <p><span className="font-medium text-[var(--color-text-primary)]">Cooking Assistant:</span> Step-by-step guidance with timers and voice instructions</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] mt-2 flex-shrink-0" />
              <p><span className="font-medium text-[var(--color-text-primary)]">Meal Planning:</span> Plan your weekly meals and generate shopping lists automatically</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] mt-2 flex-shrink-0" />
              <p><span className="font-medium text-[var(--color-text-primary)]">Inventory Tracking:</span> Keep track of ingredients and reduce food waste</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] mt-2 flex-shrink-0" />
              <p><span className="font-medium text-[var(--color-text-primary)]">Community:</span> Share recipes, get inspired, and connect with fellow food lovers</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] mt-2 flex-shrink-0" />
              <p><span className="font-medium text-[var(--color-text-primary)]">Smart Scanning:</span> Scan barcodes and receipts to add items instantly</p>
            </div>
          </div>
        </Card>

        {/* Social & Contact */}
        <Card className="p-6">
          <h4 className="mb-4">Connect With Us</h4>
          <div className="space-y-3">
            <a
              href="mailto:hello@kitchennova.com"
              className="flex items-center gap-3 p-3 bg-[var(--color-cream)] rounded-lg hover:bg-[var(--color-border)] transition-colors"
            >
              <Mail size={20} className="text-[var(--color-primary)]" />
              <div className="flex-1">
                <p className="text-sm font-medium">Email Us</p>
                <p className="text-xs text-[var(--color-text-secondary)]">hello@kitchennova.com</p>
              </div>
            </a>
            
            <a
              href="https://kitchennova.com"
              className="flex items-center gap-3 p-3 bg-[var(--color-cream)] rounded-lg hover:bg-[var(--color-border)] transition-colors"
            >
              <Globe size={20} className="text-[var(--color-primary)]" />
              <div className="flex-1">
                <p className="text-sm font-medium">Website</p>
                <p className="text-xs text-[var(--color-text-secondary)]">kitchennova.com</p>
              </div>
            </a>

            <div className="pt-3 border-t border-[var(--color-border)]">
              <p className="text-sm text-[var(--color-text-secondary)] mb-3">Follow us on social media:</p>
              <div className="flex gap-3">
                <button className="w-12 h-12 rounded-full bg-[var(--color-cream)] hover:bg-[var(--color-border)] flex items-center justify-center transition-colors">
                  <Instagram size={20} className="text-[var(--color-text-primary)]" />
                </button>
                <button className="w-12 h-12 rounded-full bg-[var(--color-cream)] hover:bg-[var(--color-border)] flex items-center justify-center transition-colors">
                  <Facebook size={20} className="text-[var(--color-text-primary)]" />
                </button>
                <button className="w-12 h-12 rounded-full bg-[var(--color-cream)] hover:bg-[var(--color-border)] flex items-center justify-center transition-colors">
                  <Twitter size={20} className="text-[var(--color-text-primary)]" />
                </button>
              </div>
            </div>
          </div>
        </Card>

        {/* Legal Links */}
        <Card className="p-6">
          <h4 className="mb-4">Legal</h4>
          <div className="space-y-2">
            <button
              onClick={() => onNavigate('terms-of-service')}
              className="w-full text-left p-3 bg-[var(--color-cream)] rounded-lg hover:bg-[var(--color-border)] transition-colors text-sm font-medium"
            >
              Terms of Service →
            </button>
            <button
              onClick={() => onNavigate('privacy-policy')}
              className="w-full text-left p-3 bg-[var(--color-cream)] rounded-lg hover:bg-[var(--color-border)] transition-colors text-sm font-medium"
            >
              Privacy Policy →
            </button>
          </div>
        </Card>

        {/* Acknowledgments */}
        <Card className="p-6">
          <h4 className="mb-4">Acknowledgments</h4>
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
            Special thanks to our amazing community of users, recipe contributors, beta testers, and everyone who has supported Smart Chef. Your feedback and enthusiasm make this app better every day.
          </p>
        </Card>

        {/* Copyright */}
        <div className="text-center text-sm text-[var(--color-text-secondary)] py-4">
          <p>© 2025 Smart Chef. All rights reserved.</p>
          <p className="mt-1">Made with ❤️ for food lovers everywhere</p>
        </div>
      </div>
    </div>
  );
}