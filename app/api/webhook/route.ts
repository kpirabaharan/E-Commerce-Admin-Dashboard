import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

import stripe from '@/lib/stripe';
import prismadb from '@/lib/prismadb';

const relevantEvents = new Set(['checkout.session.completed']);

export const POST = async (request: Request) => {
  const body = await request.text();
  const sig = headers().get('Stripe-Signature');

  const webhookSecret =
    process.env.STRIPE_WEBHOOK_SECRET_LIVE ?? process.env.STRIPE_WEBHOOK_SECRET;
  let event: Stripe.Event;

  try {
    if (!sig || !webhookSecret) return;
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.log(`❌ Error message: ${err.message}`);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const address = session?.customer_details?.address;

  const addressComponents = [
    address?.line1,
    address?.line2,
    address?.city,
    address?.state,
    address?.postal_code,
    address?.country,
  ];

  const addressString = addressComponents.filter((c) => c !== null).join(', ');

  if(event.type === 'checkout.session.completed'){
    
  }
};
