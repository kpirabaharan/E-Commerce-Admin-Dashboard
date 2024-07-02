import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
  apiVersion: '2023-10-16',
  typescript: true,
  appInfo: {
    name: 'E Commerce',
    version: '0.1.0',
  },
});

export default stripe;
