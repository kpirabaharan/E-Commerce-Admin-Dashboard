import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

import stripe from '@/lib/stripe';
import prismadb from '@/lib/prismadb';
import { sendEmail, sendEmailConfig } from '@/lib/sendEmail';

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

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const customer = (await stripe.customers.retrieve(
          session.customer as string,
        )) as Stripe.Customer;

        const addressComponents = [
          customer.address?.line1,
          customer.address?.line2,
          customer.address?.city,
          customer.address?.state,
          customer.address?.postal_code,
          customer.address?.country,
        ];

        const addressString = addressComponents
          .filter((c) => c !== null)
          .join(', ');

        const order = await prismadb.order.update({
          where: {
            id: session?.metadata?.orderId,
          },
          data: {
            isPaid: true,
            name: customer.name!,
            email: customer.email!,
            address: addressString,
            phone: customer.phone!,
          },
          include: { orderItems: { include: { product: true } }, store: true },
        });

        const orderedProducts = order.orderItems.map((orderItem) => ({
          productId: orderItem.productId,
          amount: orderItem.quantity,
        }));

        order.orderItems.forEach(async (orderItem) => {
          const selectedProduct = orderedProducts.find(
            (orderedProduct) =>
              orderedProduct.productId === orderItem.productId,
          );
          const isArchived =
            orderItem.product.amount === (selectedProduct?.amount ?? 1);
          const amount =
            orderItem.product.amount - (selectedProduct?.amount ?? 1);

          await prismadb.product.update({
            where: { id: orderItem.productId },
            data: { amount, isArchived },
          });
        });

        /*  
        * Send Email Feature Disabled 
        const totalItems = order.orderItems.reduce(
          (total, item) => total + item.quantity,
          0,
        );

        const subject = `Your ${order.store.name}, Inc. order #${
          order.id
        } of ${totalItems} item${totalItems > 1 && 's'} has been placed`;

        const body = `<p>Click <a href="${session?.metadata?.storeUrl}/order/${order.id}">here</a> to check the status of your order.</p>`;

        const configEmailData: sendEmailConfig = {
          toEmail: order.email,

          subject,
          body,
        };

        sendEmail(configEmailData);
        * End Email Feature
        */

        await stripe.customers.del(session.customer as string);

        break;
      }
      case 'checkout.session.completed': {
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

        const order = await prismadb.order.update({
          where: { id: session?.metadata?.orderId },
          data: {
            isPaid: true,
            name: session.customer_details?.name || '',
            email: session.customer_details?.email || '',
            address: addressString,
            phone: session?.customer_details?.phone || '',
          },
          include: { orderItems: { include: { product: true } }, store: true },
        });

        const orderedProducts = order.orderItems.map((orderItem) => ({
          productId: orderItem.productId,
          amount: orderItem.quantity,
        }));

        order.orderItems.forEach(async (orderItem) => {
          const selectedProduct = orderedProducts.find(
            (orderedProduct) =>
              orderedProduct.productId === orderItem.productId,
          );
          const isArchived =
            orderItem.product.amount === (selectedProduct?.amount ?? 1);
          const amount =
            orderItem.product.amount - (selectedProduct?.amount ?? 1);

          await prismadb.product.update({
            where: { id: orderItem.productId },
            data: { amount, isArchived },
          });
        });

        const totalItems = order.orderItems.reduce(
          (total, item) => total + item.quantity,
          0,
        );

        const subject = `Your ${order.store.name}, Inc. order #${
          order.id
        } of ${totalItems} item${totalItems > 1 && 's'} has been placed`;

        const body = `<p>Click <a href="${session?.metadata?.storeUrl}/order/${order.id}">here</a> to check the status of your order.</p>`;

        const configEmailData: sendEmailConfig = {
          toEmail: order.email,

          subject,
          body,
        };

        sendEmail(configEmailData);

        break;
      }
      case 'checkout.session.expired': {
        await prismadb.order.delete({
          where: { id: session?.metadata?.orderId },
          include: { orderItems: true },
        });

        break;
      }
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
