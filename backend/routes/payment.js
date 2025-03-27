const express = require('express');
const Stripe = require('stripe');
require('dotenv').config();

const router = express.Router();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Create a Stripe Payment Intent
router.post('/create-payment-intent', async (req, res) => {
    try {
        console.log("Received request:", req.body);
        console.log("Stripe Secret Key:", process.env.STRIPE_SECRET_KEY);

        const { amount, currency } = req.body;

        if (!amount || !currency) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Step 1: Create PaymentIntent
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            payment_method_types: ['card'],  // Explicitly specify allowed methods
            confirmation_method: "manual",   // Prevent auto-confirmation
        });

        res.json({ clientSecret: paymentIntent.client_secret, paymentIntentId: paymentIntent.id });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({ error: error.message });
    }
});

// Step 2: Attach Payment Method and Confirm
router.post('/confirm-payment-intent', async (req, res) => {
    try {
        const { paymentIntentId, paymentMethodId } = req.body;

        if (!paymentIntentId || !paymentMethodId) {
            return res.status(400).json({ error: 'Missing payment intent ID or payment method ID' });
        }

        // Attach payment method
        await stripe.paymentIntents.update(paymentIntentId, {
            payment_method: paymentMethodId
        });

        // Confirm PaymentIntent
        const confirmedPaymentIntent = await stripe.paymentIntents.confirm(paymentIntentId);

        res.json({ success: true, paymentIntent: confirmedPaymentIntent });
    } catch (error) {
        console.error('Error confirming payment intent:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
