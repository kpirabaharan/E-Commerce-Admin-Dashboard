import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

import stripe from '@/lib/stripe';
import prismadb from '@/lib/prismadb';
import { map } from 'lodash';

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

        console.log({ order });

        const orderedProducts = order.orderItems.map((orderItem) => ({
          productId: orderItem.productId,
          amount: orderItem.amount,
        }));

        console.log({ orderedProducts });

        const products = await prismadb.product.findMany({
          where: { id: { in: map(orderedProducts, 'productId') } },
        });

        console.log({ products });

        products.forEach(async (product) => {
          const selectedProduct = orderedProducts.find(
            (orderedProduct) => orderedProduct.productId === product.id,
          );
          const isArchived = product.amount === (selectedProduct?.amount ?? 1);
          const amount = product.amount - (selectedProduct?.amount ?? 1);

          console.log({ isArchived, amount });

          const updatedProduct = await prismadb.product.update({
            where: { id: product.id },
            data: { amount, isArchived },
          });
          
          console.log(updatedProduct);
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
