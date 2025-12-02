import React, { useState, useEffect } from 'react';
import { ArrowLeft, CreditCard, Smartphone, CheckCircle, AlertCircle } from 'lucide-react';
import { Header } from '../../components/Header';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Input } from '../../components/Input';
import { LoadingSpinner } from '../../components/LoadingSpinner';

interface CheckoutScreenProps {
  onNavigate: (screen: string) => void;
  onSubscribe: () => void;
  selectedPlan?: {
    id: 'monthly' | 'yearly' | 'lifetime';
    name: string;
    price: string;
    period: string;
    badge: string | null;
    savings: string | null;
  };
}

export function CheckoutScreen({ onNavigate, onSubscribe, selectedPlan }: CheckoutScreenProps) {
  const [selectedMethod, setSelectedMethod] = useState<'card' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [freeTrialUsed, setFreeTrialUsed] = useState(false);
  
  // Card payment form state
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  
  // Check if free trial has been used
  useEffect(() => {
    const trialData = localStorage.getItem('freeTrialData');
    if (trialData) {
      setFreeTrialUsed(true);
    }
  }, []);
  
  // Default to yearly plan if no plan is selected
  const plan = selectedPlan || {
    id: 'yearly' as const,
    name: 'Yearly',
    price: '$35.99',
    originalPrice: '$47.88',
    period: '/year',
    badge: 'Most Popular',
    savings: 'Save 25%',
    trial: '3 months free'
  };
  
  const getPriceValue = (price: string) => price.replace('$', '');
  
  const getBillingPeriodText = () => {
    switch (plan.id) {
      case 'monthly':
        return 'Monthly';
      case 'yearly':
        return 'Yearly';
      case 'lifetime':
        return 'One-time payment';
      default:
        return 'Yearly';
    }
  };
  
  const getRenewalText = () => {
    if (plan.id === 'lifetime') {
      return 'One-time payment. No renewals.';
    }
    return plan.id === 'monthly' 
      ? 'Billed monthly. Cancel anytime.'
      : 'Billed annually. Cancel anytime.';
  };
  
  const handleFreeTrial = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Calculate trial end date (3 months from now)
      const trialStartDate = new Date();
      const trialEndDate = new Date();
      trialEndDate.setMonth(trialEndDate.getMonth() + 3);
      
      // Save free trial data to localStorage
      const freeTrialData = {
        startDate: trialStartDate.toISOString(),
        endDate: trialEndDate.toISOString(),
        isActive: true,
        usedAt: Date.now()
      };
      
      localStorage.setItem('freeTrialData', JSON.stringify(freeTrialData));
      
      // Set premium status for 3 months
      localStorage.setItem('isPremium', 'true');
      localStorage.setItem('subscriptionData', JSON.stringify({
        id: 'free_trial_' + Date.now(),
        planId: 'trial',
        status: 'trial',
        startDate: trialStartDate.toISOString(),
        endDate: trialEndDate.toISOString(),
        autoRenew: false,
        isTrial: true,
        demoMode: true
      }));
      
      // Success!
      setIsProcessing(false);
      setIsSuccess(true);
      setFreeTrialUsed(true);
      
      // Navigate after 2 seconds
      setTimeout(() => {
        onSubscribe();
      }, 2000);
      
    } catch (error: any) {
      console.error('Free trial error:', error);
      setErrorMessage('Failed to start free trial. Please try again.');
      setIsProcessing(false);
    }
  };

  const handleSubscribe = async () => {
    // Clear any previous errors
    setErrorMessage('');
    
    // Validate card details
    if (!cardNumber || !cardName || !expiryDate || !cvv) {
      setErrorMessage('Please fill in all card details');
      return;
    }
    if (cardNumber.replace(/\s/g, '').length !== 16) {
      setErrorMessage('Please enter a valid 16-digit card number');
      return;
    }
    if (cvv.length !== 3 && cvv.length !== 4) {
      setErrorMessage('Please enter a valid CVV (3-4 digits)');
      return;
    }
    
    // Validate expiry date
    const [month, year] = expiryDate.split('/');
    if (!month || !year || parseInt(month) < 1 || parseInt(month) > 12) {
      setErrorMessage('Please enter a valid expiry date (MM/YY)');
      return;
    }
    
    setIsProcessing(true);
    
    // ==========================================
    // TEMPORARY DEMO MODE - MOCK PAYMENT FLOW
    // ==========================================
    // Backend is not implemented yet, so we simulate the payment
    // Remove this section when you implement real Stripe integration
    
    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Calculate trial end date (3 months from now)
      const trialEndDate = new Date();
      trialEndDate.setMonth(trialEndDate.getMonth() + 3);
      
      // Calculate subscription end date based on plan
      const startDate = new Date();
      let endDate = new Date(startDate);
      
      switch (plan.id) {
        case 'monthly':
          endDate.setMonth(endDate.getMonth() + 1);
          break;
        case 'yearly':
          endDate.setFullYear(endDate.getFullYear() + 1);
          break;
        case 'lifetime':
          endDate = new Date('2099-12-31');
          break;
      }
      
      // Save subscription data to localStorage (demo mode)
      localStorage.setItem('isPremium', 'true');
      localStorage.setItem('subscriptionData', JSON.stringify({
        id: 'demo_sub_' + Date.now(),
        planId: plan.id,
        status: 'active',
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        trialEndDate: plan.id !== 'lifetime' ? trialEndDate.toISOString() : null,
        autoRenew: plan.id !== 'lifetime',
        demoMode: true
      }));
      
      // Success!
      setIsProcessing(false);
      setIsSuccess(true);
      
      // Navigate after 2 seconds
      setTimeout(() => {
        onSubscribe();
      }, 2000);
      
    } catch (error: any) {
      console.error('Payment error:', error);
      setErrorMessage('Payment processing failed. Please try again.');
      setIsProcessing(false);
    }
    
    // ==========================================
    // PRODUCTION CODE - REAL STRIPE INTEGRATION
    // ==========================================
    // Uncomment this section when backend is ready
    // Remove the demo mode code above
    /*
    try {
      // Get auth token
      const authToken = localStorage.getItem('authToken');
      
      // STEP 1: Create Payment Intent on backend
      // Backend creates a Stripe PaymentIntent and returns client_secret
      const paymentIntentResponse = await fetch('/api/payments/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          planId: plan.id,
          amount: parseFloat(getPriceValue(plan.price)) * 100, // Convert to cents
          currency: 'usd'
        })
      });
      
      if (!paymentIntentResponse.ok) {
        throw new Error('Failed to create payment intent');
      }
      
      const { clientSecret, paymentIntentId } = await paymentIntentResponse.json();
      
      // STEP 2: Tokenize card details using Stripe.js
      // ⚠️ NEVER send raw card details to your backend
      // Always use Stripe.js to tokenize card data on client-side
      //
      // const stripe = await loadStripe('pk_live_YOUR_PUBLISHABLE_KEY');
      // const { error, paymentMethod } = await stripe.createPaymentMethod({
      //   type: 'card',
      //   card: {
      //     number: cardNumber.replace(/\s/g, ''),
      //     exp_month: parseInt(month),
      //     exp_year: parseInt(`20${year}`),
      //     cvc: cvv
      //   },
      //   billing_details: {
      //     name: cardName
      //   }
      // });
      //
      // if (error) {
      //   setErrorMessage(error.message || 'Payment failed');
      //   setIsProcessing(false);
      //   return;
      // }
      
      // STEP 3: Confirm payment
      // const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
      //   clientSecret,
      //   {
      //     payment_method: paymentMethod.id
      //   }
      // );
      //
      // if (confirmError) {
      //   setErrorMessage(confirmError.message || 'Payment confirmation failed');
      //   setIsProcessing(false);
      //   return;
      // }
      
      // STEP 4: Create subscription on backend
      // Backend verifies payment and creates subscription record
      const subscriptionResponse = await fetch('/api/subscriptions/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          planId: plan.id,
          paymentIntentId: paymentIntentId, // Use real paymentIntent.id in production
          paymentMethodId: 'pm_mock_12345', // Use real paymentMethod.id in production
          amount: parseFloat(getPriceValue(plan.price)),
          currency: 'usd',
          interval: plan.id === 'lifetime' ? 'one_time' : plan.id
        })
      });
      
      if (!subscriptionResponse.ok) {
        throw new Error('Failed to create subscription');
      }
      
      const subscription = await subscriptionResponse.json();
      
      // STEP 5: Update local storage with premium status
      localStorage.setItem('isPremium', 'true');
      localStorage.setItem('subscriptionData', JSON.stringify({
        id: subscription.id,
        planId: plan.id,
        status: 'active',
        startDate: new Date().toISOString(),
        endDate: subscription.endDate,
        autoRenew: plan.id !== 'lifetime'
      }));
      
      // Success!
      setIsProcessing(false);
      setIsSuccess(true);
      
      // Navigate after 2 seconds
      setTimeout(() => {
        onSubscribe();
      }, 2000);
      
    } catch (error: any) {
      console.error('Payment error:', error);
      setErrorMessage(error.message || 'Payment failed. Please try again.');
      setIsProcessing(false);
    }
    */
  };
  
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };
  
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.slice(0, 2) + '/' + v.slice(2, 4);
    }
    return v;
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[var(--color-cream)] flex flex-col items-center justify-center p-6">
        <Card className="p-8 text-center max-w-sm w-full animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 mb-6">
            <CheckCircle size={40} className="text-white" />
          </div>
          <h2 className="mb-3">Welcome to Premium!</h2>
          <p className="text-[var(--color-text-secondary)] mb-6">
            You now have access to all premium features. Enjoy your Smart Chef experience!
          </p>
          <LoadingSpinner size={32} />
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      <Header title="Checkout" onBack={() => onNavigate('subscription')} />

      <div className="px-4 py-6 space-y-6">
        {/* Order Summary */}
        <Card className="p-6">
          <h3 className="mb-4">Order Summary</h3>
          
          {/* Trial Notice for subscription plans */}
          {plan.id !== 'lifetime' && (
            <div className="mb-4 p-3 bg-green-500/10 border-2 border-green-500/30 rounded-lg">
              <p className="text-sm text-green-700 text-center font-semibold">
                🎉 Your 3-month free trial starts today!
              </p>
              <p className="text-xs text-green-600 text-center mt-1">
                You won't be charged until {new Date(new Date().setMonth(new Date().getMonth() + 3)).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          )}
          
          <div className="space-y-3 pb-4 border-b border-[var(--color-border)]">
            <div className="flex justify-between">
              <span className="text-[var(--color-text-secondary)]">Smart Chef Premium</span>
              <span className="font-semibold">{plan.price}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-text-secondary)]">Billing Period</span>
              <span className="font-semibold">{getBillingPeriodText()}</span>
            </div>
            {plan.id !== 'lifetime' && (
              <div className="flex justify-between">
                <span className="text-[var(--color-text-secondary)]">Free Trial</span>
                <span className="font-semibold text-green-600">3 months</span>
              </div>
            )}
          </div>
          <div className="flex justify-between items-center pt-4">
            <span className="text-lg">Due Today</span>
            <span className="text-2xl">{plan.id !== 'lifetime' ? '$0.00' : plan.price}</span>
          </div>
          {plan.id !== 'lifetime' && (
            <p className="text-xs text-[var(--color-text-secondary)] mt-2 text-center">
              First payment of {plan.price} on {new Date(new Date().setMonth(new Date().getMonth() + 3)).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          )}
          <p className="text-xs text-[var(--color-text-secondary)] mt-3 text-center">
            {getRenewalText()}
          </p>
        </Card>

        {/* Payment Method */}
        <div>
          <h3 className="mb-3">Payment Method</h3>
          <div className="space-y-3">
            {/* Start Free Trial Button */}
            {!freeTrialUsed && plan.id !== 'lifetime' && (
              <Button
                variant="premium"
                size="lg"
                fullWidth
                onClick={handleFreeTrial}
                disabled={isProcessing}
                className="shadow-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              >
                {isProcessing ? (
                  <>
                    <LoadingSpinner size={20} />
                    Starting Trial...
                  </>
                ) : (
                  <>
                    🎉 Start Free Trial (No Payment Required)
                  </>
                )}
              </Button>
            )}
            
            {/* Trial Used Message */}
            {freeTrialUsed && (
              <Card className="p-4 bg-amber-500/10 border-2 border-amber-500/30">
                <p className="text-sm text-amber-700 text-center">
                  ℹ️ You have already used your free trial
                </p>
              </Card>
            )}
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--color-border)]"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[var(--color-cream)] text-[var(--color-text-secondary)]">
                  or pay with card
                </span>
              </div>
            </div>
            
            <Card
              onClick={() => setSelectedMethod('card')}
              className={`p-4 cursor-pointer transition-all ${
                selectedMethod === 'card'
                  ? 'border-2 border-[var(--color-primary)]'
                  : 'border-2 border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                  <CreditCard size={24} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">Credit or Debit Card</p>
                  <p className="text-sm text-[var(--color-text-secondary)]">Visa, Mastercard, Amex</p>
                </div>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedMethod === 'card'
                      ? 'bg-[var(--color-primary)] border-[var(--color-primary)]'
                      : 'border-[var(--color-border)]'
                  }`}
                >
                  {selectedMethod === 'card' && <CheckCircle size={16} className="text-white" />}
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Card Payment Form */}
        {selectedMethod === 'card' && (
          <div className="space-y-4">
            {/* Error Message */}
            {errorMessage && (
              <Card className="p-4 bg-red-500/10 border-2 border-red-500/30">
                <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle size={20} />
                  <p className="text-sm">{errorMessage}</p>
                </div>
              </Card>
            )}
            
            <Input
              label="Card Number"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              placeholder="1234 5678 9012 3456"
              type="text"
            />
            <Input
              label="Cardholder Name"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              placeholder="John Doe"
              type="text"
            />
            <div className="flex space-x-4">
              <Input
                label="Expiry Date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                placeholder="MM/YY"
                type="text"
                className="w-1/2"
              />
              <Input
                label="CVV"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                placeholder="123"
                type="text"
                className="w-1/2"
              />
            </div>
          </div>
        )}

        {/* Security Notice */}
        <Card className="p-4 bg-blue-500/10 border-2 border-blue-500/30">
          <p className="text-sm text-[var(--color-text-primary)] text-center">
            🔒 Your payment is secure and encrypted
          </p>
        </Card>

        {/* Subscribe Button */}
        <Button
          variant="premium"
          size="lg"
          fullWidth
          onClick={handleSubscribe}
          disabled={isProcessing}
          className="shadow-xl"
        >
          {isProcessing ? (
            <>
              <LoadingSpinner size={20} />
              Processing...
            </>
          ) : (
            'Start Subscription'
          )}
        </Button>

        {/* Terms */}
        <p className="text-xs text-center text-[var(--color-text-secondary)]">
          By subscribing, you agree to our{' '}
          <button
            onClick={() => onNavigate('terms-of-service')}
            className="text-[var(--color-primary)] hover:underline"
          >
            Terms of Service
          </button>{' '}
          and{' '}
          <button
            onClick={() => onNavigate('privacy-policy')}
            className="text-[var(--color-primary)] hover:underline"
          >
            Privacy Policy
          </button>
          . Subscription will auto-renew unless cancelled 24 hours before the renewal date.
        </p>
      </div>
    </div>
  );
}