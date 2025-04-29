const express = require('express');
const crypto = require('crypto');
const axios = require('axios');
const querystring = require('querystring');
const Stripe = require('stripe');
const { MERCHANT_ID, MERCHANT_SECRET, STRIPE_SECRET_KEY } = require('../config/config');

const stripe = new Stripe(STRIPE_SECRET_KEY);
const router = express.Router();

// Endpoint to initiate payment
router.post('/initiate', async (req, res) => {
  const { orderId, amount, currency, userEmail, userPhone } = req.body;

  if (!orderId || !amount || !currency || !userEmail || !userPhone) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const paymentData = {
      merchant_id: '1230296', // Your Merchant ID
      return_url: `http://localhost:5100/api/payment/success`, // Dynamic return URL
      cancel_url: `http://localhost:5100/api/payment/cancel`, // Dynamic cancel URL
      notify_url: `http://localhost:5100/api/payment/notify`, // Dynamic notify URL
      order_id: orderId,
      items: `Order #${orderId}`,
      amount,
      currency: 'LKR',
      first_name: 'User',
      last_name: 'Name',
      email: userEmail,
      phone: userPhone,
      address: 'No Address',
      city: 'Colombo',
      country: 'Sri Lanka',
    };

    const paymentUrl = `https://sandbox.payhere.lk/pay/checkout?${querystring.stringify(paymentData)}`;
    console.log('Generated Payment URL:', paymentUrl); // Log for debugging

    res.status(200).json({
      message: 'Redirect to PayHere',
      paymentUrl,
    });
  } catch (error) {
    console.error('Error initiating payment:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Endpoint to handle payment success
router.post('/success', async (req, res) => {
  const { order_id, status_code, md5sig } = req.body;

  if (status_code !== '2') {
    return res.status(400).json({ message: 'Payment not successful' });
  }

  // Verify MD5 signature
  const generatedMd5 = crypto
    .createHash('md5')
    .update(`${MERCHANT_ID}${order_id}${req.body.payhere_amount}${req.body.payhere_currency}${MERCHANT_SECRET}`)
    .digest('hex');

  if (generatedMd5 !== md5sig) {
    return res.status(400).json({ message: 'Invalid signature' });
  }

  try {
    // Update order status in OrderService
    await axios.put(`http://localhost:4900/api/order/${order_id}/status`, { status: 'Successful' });

    // Send payment success email
    await axios.post(`http://localhost:4900/api/order/send-payment-email`, { orderId: order_id });

    res.status(200).json({ message: 'Payment successful and order updated' });
  } catch (error) {
    console.error('Error updating order status:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Endpoint to create payment intent with Stripe
router.post('/create-payment-intent', async (req, res) => {
  const { orderId, amount, currency } = req.body;

  try {
    // Create a PaymentIntent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency ,
      metadata: { orderId },
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Endpoint to handle Stripe payment success
router.post('/payment-success', async (req, res) => {
  const { orderId } = req.body;

  try {
    // Update order status in OrderService
    await axios.put(`http://localhost:5000/api/order/${orderId}/status`, { status: 'Successful' });

    // Send payment success email
    await axios.post(`http://localhost:5000/api/order/send-payment-email`, { orderId });

    res.status(200).json({ message: 'Payment successful and order updated' });
  } catch (error) {
    console.error('Error updating order status:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;



