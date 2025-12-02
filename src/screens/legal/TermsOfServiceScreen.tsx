import React from 'react';
import { FileText, Calendar, Shield, AlertCircle } from 'lucide-react';
import { Header } from '../../components/Header';
import { Card } from '../../components/Card';

interface TermsOfServiceScreenProps {
  onNavigate: (screen: string) => void;
}

export function TermsOfServiceScreen({ onNavigate }: TermsOfServiceScreenProps) {
  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      <Header title="Terms of Service" onBack={() => onNavigate('settings')} />

      <div className="px-4 py-6 space-y-6 pb-20">
        {/* Header Info */}
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center flex-shrink-0">
              <FileText size={24} className="text-[var(--color-primary)]" />
            </div>
            <div className="flex-1">
              <h3 className="mb-2">Smart Chef Terms of Service</h3>
              <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                <Calendar size={16} />
                <span>Last updated: November 29, 2025</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Important Notice */}
        <Card className="p-4 bg-[var(--color-warning)]/10 border-2 border-[var(--color-warning)]/20">
          <div className="flex gap-3">
            <AlertCircle size={20} className="text-[var(--color-warning)] flex-shrink-0 mt-0.5" />
            <div>
              <h5 className="mb-1 text-[var(--color-warning)]">Important Notice</h5>
              <p className="text-sm text-[var(--color-text-secondary)]">
                By using Smart Chef, you agree to these terms. Please read them carefully.
              </p>
            </div>
          </div>
        </Card>

        {/* 1. Acceptance of Terms */}
        <Card className="p-6">
          <h4 className="mb-4">1. Acceptance of Terms</h4>
          <div className="space-y-3 text-sm text-[var(--color-text-secondary)]">
            <p>
              Welcome to Smart Chef! These Terms of Service ("Terms") govern your access to and use of the Smart Chef mobile application and services (collectively, the "Service").
            </p>
            <p>
              By downloading, installing, or using Smart Chef, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use our Service.
            </p>
          </div>
        </Card>

        {/* 2. Description of Service */}
        <Card className="p-6">
          <h4 className="mb-4">2. Description of Service</h4>
          <div className="space-y-3 text-sm text-[var(--color-text-secondary)]">
            <p>
              Smart Chef is a cooking and recipe management application that provides:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Access to recipes and cooking instructions</li>
              <li>Meal planning and grocery list management</li>
              <li>Inventory tracking features</li>
              <li>Community features for sharing recipes</li>
              <li>Premium features via subscription</li>
            </ul>
          </div>
        </Card>

        {/* 3. User Accounts */}
        <Card className="p-6">
          <h4 className="mb-4">3. User Accounts</h4>
          <div className="space-y-3 text-sm text-[var(--color-text-secondary)]">
            <p className="font-medium text-[var(--color-text-primary)]">Account Creation:</p>
            <p>
              You may need to create an account to access certain features. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.
            </p>
            <p className="font-medium text-[var(--color-text-primary)]">Account Security:</p>
            <p>
              You must notify us immediately of any unauthorized use of your account. We are not liable for any loss or damage from your failure to maintain account security.
            </p>
            <p className="font-medium text-[var(--color-text-primary)]">Account Termination:</p>
            <p>
              We reserve the right to suspend or terminate accounts that violate these Terms or engage in fraudulent, abusive, or illegal activities.
            </p>
          </div>
        </Card>

        {/* 4. Premium Subscription */}
        <Card className="p-6">
          <h4 className="mb-4">4. Premium Subscription</h4>
          <div className="space-y-3 text-sm text-[var(--color-text-secondary)]">
            <p className="font-medium text-[var(--color-text-primary)]">Subscription Terms:</p>
            <p>
              Smart Chef Premium is a paid subscription service offering enhanced features. Subscriptions are billed monthly or annually based on your selection.
            </p>
            <p className="font-medium text-[var(--color-text-primary)]">Auto-Renewal:</p>
            <p>
              Your subscription will automatically renew unless you cancel at least 24 hours before the end of the current billing period.
            </p>
            <p className="font-medium text-[var(--color-text-primary)]">Cancellation:</p>
            <p>
              You may cancel your subscription at any time through your account settings. Cancellation takes effect at the end of the current billing period.
            </p>
            <p className="font-medium text-[var(--color-text-primary)]">Refunds:</p>
            <p>
              Refunds are handled according to the policies of the platform through which you purchased (Apple App Store or Google Play Store).
            </p>
          </div>
        </Card>

        {/* 5. User Content */}
        <Card className="p-6">
          <h4 className="mb-4">5. User Content</h4>
          <div className="space-y-3 text-sm text-[var(--color-text-secondary)]">
            <p className="font-medium text-[var(--color-text-primary)]">Your Content:</p>
            <p>
              You retain ownership of content you create and share on Smart Chef (recipes, photos, comments). By sharing content, you grant us a license to use, display, and distribute it within the Service.
            </p>
            <p className="font-medium text-[var(--color-text-primary)]">Content Standards:</p>
            <p>
              You agree not to post content that is illegal, offensive, infringes on others' rights, or violates these Terms. We reserve the right to remove any content that violates our standards.
            </p>
            <p className="font-medium text-[var(--color-text-primary)]">Community Guidelines:</p>
            <p>
              Be respectful, authentic, and helpful. No spam, harassment, or inappropriate content. Violations may result in content removal or account suspension.
            </p>
          </div>
        </Card>

        {/* 6. Intellectual Property */}
        <Card className="p-6">
          <h4 className="mb-4">6. Intellectual Property</h4>
          <div className="space-y-3 text-sm text-[var(--color-text-secondary)]">
            <p>
              All content, features, and functionality of Smart Chef (including but not limited to text, graphics, logos, icons, images, and software) are owned by Smart Chef and are protected by copyright, trademark, and other intellectual property laws.
            </p>
            <p>
              You may not copy, modify, distribute, sell, or lease any part of our Service without our express written permission.
            </p>
          </div>
        </Card>

        {/* 7. Prohibited Uses */}
        <Card className="p-6">
          <h4 className="mb-4">7. Prohibited Uses</h4>
          <div className="space-y-3 text-sm text-[var(--color-text-secondary)]">
            <p>You agree not to:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Use the Service for any illegal purpose</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with or disrupt the Service</li>
              <li>Use automated systems to access the Service</li>
              <li>Impersonate others or provide false information</li>
              <li>Harvest or collect user data without consent</li>
              <li>Upload viruses or malicious code</li>
            </ul>
          </div>
        </Card>

        {/* 8. Disclaimer of Warranties */}
        <Card className="p-6">
          <h4 className="mb-4">8. Disclaimer of Warranties</h4>
          <div className="space-y-3 text-sm text-[var(--color-text-secondary)]">
            <p>
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE.
            </p>
            <p className="font-medium text-[var(--color-text-primary)]">Recipe Information:</p>
            <p>
              Recipes are provided for informational purposes only. We are not responsible for the results of following any recipe or for any food allergies, dietary restrictions, or health issues that may result from using our recipes.
            </p>
          </div>
        </Card>

        {/* 9. Limitation of Liability */}
        <Card className="p-6">
          <h4 className="mb-4">9. Limitation of Liability</h4>
          <div className="space-y-3 text-sm text-[var(--color-text-secondary)]">
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, SMART CHEF SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES.
            </p>
            <p>
              OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID TO US IN THE TWELVE MONTHS BEFORE THE CLAIM AROSE.
            </p>
          </div>
        </Card>

        {/* 10. Privacy */}
        <Card className="p-6">
          <h4 className="mb-4">10. Privacy</h4>
          <div className="space-y-3 text-sm text-[var(--color-text-secondary)]">
            <p>
              Your use of the Service is also governed by our Privacy Policy. Please review our Privacy Policy to understand how we collect, use, and protect your information.
            </p>
            <button
              onClick={() => onNavigate('privacy-policy')}
              className="text-[var(--color-primary)] hover:underline"
            >
              Read our Privacy Policy →
            </button>
          </div>
        </Card>

        {/* 11. Changes to Terms */}
        <Card className="p-6">
          <h4 className="mb-4">11. Changes to Terms</h4>
          <div className="space-y-3 text-sm text-[var(--color-text-secondary)]">
            <p>
              We may update these Terms from time to time. We will notify you of any material changes by posting the new Terms and updating the "Last updated" date.
            </p>
            <p>
              Your continued use of the Service after changes become effective constitutes acceptance of the revised Terms.
            </p>
          </div>
        </Card>

        {/* 12. Governing Law */}
        <Card className="p-6">
          <h4 className="mb-4">12. Governing Law</h4>
          <div className="space-y-3 text-sm text-[var(--color-text-secondary)]">
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Smart Chef operates, without regard to conflict of law principles.
            </p>
          </div>
        </Card>

        {/* 13. Contact Us */}
        <Card className="p-6">
          <h4 className="mb-4">13. Contact Us</h4>
          <div className="space-y-3 text-sm text-[var(--color-text-secondary)]">
            <p>
              If you have any questions about these Terms, please contact us:
            </p>
            <div className="space-y-1 mt-3">
              <p className="font-medium text-[var(--color-text-primary)]">Email:</p>
              <a href="mailto:legal@kitchennova.com" className="text-[var(--color-primary)] hover:underline">
                legal@kitchennova.com
              </a>
            </div>
            <div className="space-y-1 mt-3">
              <p className="font-medium text-[var(--color-text-primary)]">Support:</p>
              <a href="mailto:support@kitchennova.com" className="text-[var(--color-primary)] hover:underline">
                support@kitchennova.com
              </a>
            </div>
          </div>
        </Card>

        {/* Acceptance Footer */}
        <Card className="p-6 bg-[var(--color-primary)]/5 border-2 border-[var(--color-primary)]/20">
          <div className="flex items-start gap-3">
            <Shield size={20} className="text-[var(--color-primary)] flex-shrink-0 mt-0.5" />
            <div>
              <h5 className="mb-2">Your Agreement</h5>
              <p className="text-sm text-[var(--color-text-secondary)]">
                By using Smart Chef, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}