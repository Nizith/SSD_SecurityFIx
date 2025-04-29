import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';
import Footer from "./Footer";
import Header2 from "./Header2";

const stripePromise = loadStripe('pk_test_51RIw7AQQFay0qoN9CyRtAxnalcoOmzjhAFV7rWvf8VOvb9EWOXxZlQOAre98ZsBCSObNtaBzaLUSJDEne6R5vM7X00UXSbMbAe');

export default function PaymentPage() {
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const amount = searchParams.get('amount');
  const currency = searchParams.get('currency') || 'USD';

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
        setClientSecret(data.clientSecret); // Ensure clientSecret is set
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [orderId, amount, currency]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <>
    <div className="container mx-auto px-4 py-4">
        <Header2 />
      </div>
    <div className='mt-20 mb-20'>
      {/* <h1>Payment Page</h1> */}
      {clientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm orderId={orderId} clientSecret={clientSecret} amount={amount} />
        </Elements>
      )}
    </div>
    <Footer />
    </>
  );
}