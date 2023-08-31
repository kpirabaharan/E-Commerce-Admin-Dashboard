import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

import stripe from '@/lib/stripe';
import prismadb from '@/lib/prismadb';

export const POST = async (req: Request) => {
  const body = await req.text();
  const sig = headers().get('Stripe-Signature');

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? '';
  let event: Stripe.Event;

  try {
    if (!sig || !webhookSecret) return;
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.log(`❌ Error message: ${err.message}`);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  try {
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

    const addressString = addressComponents
      .filter((c) => c !== null)
      .join(', ');

    switch (event.type) {
      case 'checkout.session.completed':
        const order = await prismadb.order.update({
          where: { id: session?.metadata?.orderId },
          data: {
            isPaid: true,
            address: addressString,
            phone: session?.customer_details?.phone || '',
          },
          include: { orderItems: true },
        });

        const productIds = order.orderItems.map(
          (orderItem) => orderItem.productId,
        );

        await prismadb.product.updateMany({
          where: { id: { in: productIds } },
          data: { isArchived: true },
        });

        break;
      case 'checkout.session.expired':
        await prismadb.order.delete({
          where: { id: session?.metadata?.orderId },
          include: { orderItems: true },
        });

        break;
    }
    return new NextResponse(`Action Complete ${event.type}`, {
      status: 200,
    });
  } catch (err) {
    console.log(err);
    return new NextResponse(
      'Webhook error: "Webhook handler failed. View logs."',
      { status: 400 },
    );
  }
};
