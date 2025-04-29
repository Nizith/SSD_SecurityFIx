import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';
import { CreditCard, ShieldCheck } from 'lucide-react';

const stripePromise = loadStripe('pk_test_51RIw7AQQFay0qoN9CyRtAxnalcoOmzjhAFV7rWvf8VOvb9EWOXxZlQOAre98ZsBCSObNtaBzaLUSJDEne6R5vM7X00UXSbMbAe');

export default function PaymentPage() {
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const amount = searchParams.get('amount');
  const currency = searchParams.get('currency') || 'USD';

  const currencySymbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
  };

  const currencySymbol = currencySymbols[currency] || currency;

  useEffect(() => {
    if (!orderId || !amount) {
      setError('Missing order information');
      setLoading(false);
      return;
    }

    fetch('http://localhost:5100/api/payment/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, amount, currency }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Payment initialization failed');
        return res.json();
      })
      .then((data) => {
        setClientSecret(data.clientSecret);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [orderId, amount, currency]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="text-red-500 text-xl font-semibold mb-4">Error</div>
          <p className="text-gray-700">{error}</p>
          <button 
            className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            onClick={() => window.history.back()}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Preparing your payment...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex items-center justify-center mb-6">
          <CreditCard className="text-blue-600 mr-2" size={24} />
          <h1 className="text-2xl font-bold text-gray-800">Secure Checkout</h1>
        </div>
        
        <div className="mb-6 bg-gray-50 p-4 rounded-md">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Order ID:</span>
            <span className="font-medium text-gray-800">{orderId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Amount:</span>
            <span className="font-medium text-gray-800">
              {currencySymbol} {parseFloat(amount).toFixed(2)}
            </span>
          </div>
        </div>
        
        {clientSecret && (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm orderId={orderId} />
          </Elements>
        )}
        
        <div className="mt-6 flex items-center justify-center text-sm text-gray-500">
          <ShieldCheck className="text-green-600 mr-2" size={16} />
          <span>Your payment information is secure</span>
        </div>
      </div>
    </div>
  );
}