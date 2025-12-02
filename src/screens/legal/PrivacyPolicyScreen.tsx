import React from 'react';
import { Shield, Calendar, Lock, Eye, Database, UserCheck, Cookie, AlertCircle } from 'lucide-react';
import { Header } from '../../components/Header';
import { Card } from '../../components/Card';

interface PrivacyPolicyScreenProps {
  onNavigate: (screen: string) => void;
}

export function PrivacyPolicyScreen({ onNavigate }: PrivacyPolicyScreenProps) {
  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      <Header title="Privacy Policy" onBack={() => onNavigate('settings')} />

      <div className="px-4 py-6 space-y-6 pb-20">
        {/* Header Info */}
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[var(--color-secondary)]/10 flex items-center justify-center flex-shrink-0">
              <Shield size={24} className="text-[var(--color-secondary)]" />
            </div>
            <div className="flex-1">
              <h3 className="mb-2">Smart Chef Privacy Policy</h3>
              <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                <Calendar size={16} />
                <span>Last updated: November 29, 2025</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Privacy Commitment */}
        <Card className="p-4 bg-[var(--color-secondary)]/10 border-2 border-[var(--color-secondary)]/20">
          <div className="flex gap-3">
            <Lock size={20} className="text-[var(--color-secondary)] flex-shrink-0 mt-0.5" />
            <div>
              <h5 className="mb-1 text-[var(--color-secondary)]">Your Privacy Matters</h5>
              <p className="text-sm text-[var(--color-text-secondary)]">
                We are committed to protecting your privacy and being transparent about how we collect, use, and protect your information.
              </p>
            </div>
          </div>
        </Card>

        {/* 1. Introduction */}
        <Card className="p-6">
          <h4 className="mb-4">1. Introduction</h4>
          <div className="space-y-3 text-sm text-[var(--color-text-secondary)]">
            <p>
              Welcome to Smart Chef's Privacy Policy. This policy describes how Smart Chef ("we," "our," or "us") collects, uses, shares, and protects your personal information when you use our mobile application and services.
            </p>
            <p>
              By using Smart Chef, you agree to the collection and use of information in accordance with this policy.
            </p>
          </div>
        </Card>

        {/* 2. Information We Collect */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Database size={20} className="text-[var(--color-primary)]" />
            <h4>2. Information We Collect</h4>
          </div>
          <div className="space-y-4 text-sm text-[var(--color-text-secondary)]">
            <div>
              <p className="font-medium text-[var(--color-text-primary)] mb-2">Information You Provide:</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Account information (name, email, password)</li>
                <li>Profile information (photo, dietary preferences, skill level)</li>
                <li>User-generated content (recipes, photos, comments, reviews)</li>
                <li>Meal plans and grocery lists you create</li>
                <li>Inventory items you track</li>
                <li>Payment information (processed securely by third-party providers)</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-[var(--color-text-primary)] mb-2">Information Collected Automatically:</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Device information (device type, operating system, unique identifiers)</li>
                <li>Usage data (features used, recipes viewed, search queries)</li>
                <li>Log data (IP address, access times, crash reports)</li>
                <li>Location data (if you grant permission, for local recommendations)</li>
                <li>Camera and photo library access (when you upload photos)</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* 3. How We Use Your Information */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Eye size={20} className="text-[var(--color-primary)]" />
            <h4>3. How We Use Your Information</h4>
          </div>
          <div className="space-y-3 text-sm text-[var(--color-text-secondary)]">
            <p>We use your information to:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Provide, maintain, and improve our Service</li>
              <li>Personalize your experience with recipe recommendations</li>
              <li>Process your premium subscription and payments</li>
              <li>Send you notifications and updates (if enabled)</li>
              <li>Respond to your support requests and feedback</li>
              <li>Analyze usage patterns to improve features</li>
              <li>Detect and prevent fraud and abuse</li>
              <li>Comply with legal obligations</li>
            </ul>
          </div>
        </Card>

        {/* 4. How We Share Your Information */}
        <Card className="p-6">
          <h4 className="mb-4">4. How We Share Your Information</h4>
          <div className="space-y-4 text-sm text-[var(--color-text-secondary)]">
            <p className="font-medium text-[var(--color-text-primary)]">We do not sell your personal information.</p>
            <p>We may share your information with:</p>
            <div>
              <p className="font-medium text-[var(--color-text-primary)] mb-2">Service Providers:</p>
              <p className="ml-2">
                Third-party vendors who help us operate our Service (cloud hosting, payment processing, analytics, customer support).
              </p>
            </div>
            <div>
              <p className="font-medium text-[var(--color-text-primary)] mb-2">Community Features:</p>
              <p className="ml-2">
                When you share recipes or interact with other users, that content is visible to the Smart Chef community.
              </p>
            </div>
            <div>
              <p className="font-medium text-[var(--color-text-primary)] mb-2">Legal Requirements:</p>
              <p className="ml-2">
                When required by law, legal process, or to protect our rights and safety.
              </p>
            </div>
            <div>
              <p className="font-medium text-[var(--color-text-primary)] mb-2">Business Transfers:</p>
              <p className="ml-2">
                In connection with a merger, acquisition, or sale of assets.
              </p>
            </div>
          </div>
        </Card>

        {/* 5. Data Security */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Lock size={20} className="text-[var(--color-primary)]" />
            <h4>5. Data Security</h4>
          </div>
          <div className="space-y-3 text-sm text-[var(--color-text-secondary)]">
            <p>
              We implement appropriate technical and organizational measures to protect your personal information:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Encryption of data in transit and at rest</li>
              <li>Secure authentication and password hashing</li>
              <li>Regular security assessments and updates</li>
              <li>Access controls and employee training</li>
              <li>Secure payment processing through PCI-compliant providers</li>
            </ul>
            <p className="mt-4">
              However, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security.
            </p>
          </div>
        </Card>

        {/* 6. Your Rights and Choices */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <UserCheck size={20} className="text-[var(--color-primary)]" />
            <h4>6. Your Rights and Choices</h4>
          </div>
          <div className="space-y-4 text-sm text-[var(--color-text-secondary)]">
            <div>
              <p className="font-medium text-[var(--color-text-primary)] mb-2">Access and Update:</p>
              <p className="ml-2">
                You can access and update your account information through the app settings.
              </p>
            </div>
            <div>
              <p className="font-medium text-[var(--color-text-primary)] mb-2">Delete Your Data:</p>
              <p className="ml-2">
                You can request deletion of your account and data by contacting us at privacy@kitchennova.com.
              </p>
            </div>
            <div>
              <p className="font-medium text-[var(--color-text-primary)] mb-2">Notifications:</p>
              <p className="ml-2">
                You can control notification preferences in the app settings.
              </p>
            </div>
            <div>
              <p className="font-medium text-[var(--color-text-primary)] mb-2">Marketing Communications:</p>
              <p className="ml-2">
                You can opt out of promotional emails by clicking the unsubscribe link.
              </p>
            </div>
            <div>
              <p className="font-medium text-[var(--color-text-primary)] mb-2">Location Data:</p>
              <p className="ml-2">
                You can disable location access through your device settings.
              </p>
            </div>
          </div>
        </Card>

        {/* 7. Data Retention */}
        <Card className="p-6">
          <h4 className="mb-4">7. Data Retention</h4>
          <div className="space-y-3 text-sm text-[var(--color-text-secondary)]">
            <p>
              We retain your personal information for as long as necessary to provide our Service and fulfill the purposes described in this policy.
            </p>
            <p>
              When you delete your account, we will delete or anonymize your personal information within 30 days, except where we are required to retain it for legal obligations.
            </p>
          </div>
        </Card>

        {/* 8. Children's Privacy */}
        <Card className="p-6">
          <h4 className="mb-4">8. Children's Privacy</h4>
          <div className="space-y-3 text-sm text-[var(--color-text-secondary)]">
            <p>
              Smart Chef is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13.
            </p>
            <p>
              If you believe we have collected information from a child under 13, please contact us immediately at privacy@kitchennova.com.
            </p>
          </div>
        </Card>

        {/* 9. Cookies and Tracking */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Cookie size={20} className="text-[var(--color-primary)]" />
            <h4>9. Cookies and Tracking Technologies</h4>
          </div>
          <div className="space-y-3 text-sm text-[var(--color-text-secondary)]">
            <p>
              We use cookies and similar tracking technologies to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Remember your preferences and settings</li>
              <li>Understand how you use our Service</li>
              <li>Improve performance and user experience</li>
              <li>Provide personalized recommendations</li>
            </ul>
            <p className="mt-4">
              You can control cookies through your browser or device settings.
            </p>
          </div>
        </Card>

        {/* 10. Third-Party Services */}
        <Card className="p-6">
          <h4 className="mb-4">10. Third-Party Services</h4>
          <div className="space-y-3 text-sm text-[var(--color-text-secondary)]">
            <p>
              Our Service may contain links to third-party websites or integrate with third-party services. We are not responsible for the privacy practices of these third parties.
            </p>
            <p className="font-medium text-[var(--color-text-primary)]">Third-party services we use:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Payment processors (Stripe, PayPal)</li>
              <li>Analytics providers (for app improvement)</li>
              <li>Cloud hosting services</li>
              <li>Customer support platforms</li>
            </ul>
          </div>
        </Card>

        {/* 11. International Data Transfers */}
        <Card className="p-6">
          <h4 className="mb-4">11. International Data Transfers</h4>
          <div className="space-y-3 text-sm text-[var(--color-text-secondary)]">
            <p>
              Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your information in accordance with this Privacy Policy.
            </p>
          </div>
        </Card>

        {/* 12. Changes to Privacy Policy */}
        <Card className="p-6">
          <h4 className="mb-4">12. Changes to This Privacy Policy</h4>
          <div className="space-y-3 text-sm text-[var(--color-text-secondary)]">
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any material changes by:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Posting the updated policy with a new "Last updated" date</li>
              <li>Sending you a notification through the app or email</li>
              <li>Requiring you to accept the new policy before continuing to use the Service</li>
            </ul>
          </div>
        </Card>

        {/* 13. GDPR Rights (EU Users) */}
        <Card className="p-6">
          <h4 className="mb-4">13. GDPR Rights (For EU Users)</h4>
          <div className="space-y-3 text-sm text-[var(--color-text-secondary)]">
            <p>
              If you are in the European Economic Area, you have additional rights under GDPR:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Right to access your personal data</li>
              <li>Right to rectification of inaccurate data</li>
              <li>Right to erasure ("right to be forgotten")</li>
              <li>Right to restrict processing</li>
              <li>Right to data portability</li>
              <li>Right to object to processing</li>
              <li>Right to withdraw consent</li>
            </ul>
            <p className="mt-4">
              To exercise these rights, contact us at gdpr@kitchennova.com.
            </p>
          </div>
        </Card>

        {/* 14. CCPA Rights (California Users) */}
        <Card className="p-6">
          <h4 className="mb-4">14. CCPA Rights (For California Users)</h4>
          <div className="space-y-3 text-sm text-[var(--color-text-secondary)]">
            <p>
              If you are a California resident, you have rights under the California Consumer Privacy Act (CCPA):
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Right to know what personal information we collect</li>
              <li>Right to know if we sell or share your personal information</li>
              <li>Right to opt-out of the sale of your personal information</li>
              <li>Right to deletion of your personal information</li>
              <li>Right to non-discrimination for exercising your rights</li>
            </ul>
            <p className="mt-4">
              To exercise these rights, contact us at ccpa@kitchennova.com.
            </p>
          </div>
        </Card>

        {/* 15. Contact Us */}
        <Card className="p-6">
          <h4 className="mb-4">15. Contact Us</h4>
          <div className="space-y-3 text-sm text-[var(--color-text-secondary)]">
            <p>
              If you have any questions about this Privacy Policy or our privacy practices, please contact us:
            </p>
            <div className="space-y-3 mt-3">
              <div>
                <p className="font-medium text-[var(--color-text-primary)]">Privacy Inquiries:</p>
                <a href="mailto:privacy@kitchennova.com" className="text-[var(--color-primary)] hover:underline">
                  privacy@kitchennova.com
                </a>
              </div>
              <div>
                <p className="font-medium text-[var(--color-text-primary)]">General Support:</p>
                <a href="mailto:support@kitchennova.com" className="text-[var(--color-primary)] hover:underline">
                  support@kitchennova.com
                </a>
              </div>
              <div>
                <p className="font-medium text-[var(--color-text-primary)]">Data Protection Officer:</p>
                <a href="mailto:dpo@kitchennova.com" className="text-[var(--color-primary)] hover:underline">
                  dpo@kitchennova.com
                </a>
              </div>
            </div>
          </div>
        </Card>

        {/* Privacy Commitment Footer */}
        <Card className="p-6 bg-[var(--color-secondary)]/5 border-2 border-[var(--color-secondary)]/20">
          <div className="flex items-start gap-3">
            <Shield size={20} className="text-[var(--color-secondary)] flex-shrink-0 mt-0.5" />
            <div>
              <h5 className="mb-2">Our Commitment to You</h5>
              <p className="text-sm text-[var(--color-text-secondary)]">
                We are committed to protecting your privacy and handling your data responsibly. Your trust is important to us.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}