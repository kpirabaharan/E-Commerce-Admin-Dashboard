import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { map } from 'lodash';

import stripe from '@/lib/stripe';
import prismadb from '@/lib/prismadb';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

interface RequestProps {
  params: { storeId: string };
}

interface orderedProduct {
  productId: string;
  quantity: number;
}

export const POST = async (req: Request, { params }: RequestProps) => {
  const {
    orderedProducts,
    storeUrl,
    isMobile,
    billingData,
  }: {
    orderedProducts: orderedProduct[];
    storeUrl: string;
    isMobile: boolean;
    billingData: any;
  } = await req.json();

  if (!orderedProducts || orderedProducts.length === 0) {
    return new NextResponse('Products are required', { status: 400 });
  }

  if (!storeUrl) {
    return new NextResponse('Store Url is required', { status: 400 });
  }

  const products = await prismadb.product.findMany({
    where: { id: { in: map(orderedProducts, 'productId') } },
    include: { images: true },
  });

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  products.forEach((product) => {
    const selectedProduct = orderedProducts.find(
      (orderedProduct) => orderedProduct.productId === product.id,
    );

    line_items.push({
      quantity: selectedProduct?.quantity,
      price_data: {
        currency: 'USD',
        product_data: { name: product.name, images: [product.images[0].url] },
        unit_amount: Math.round(Number(product.price) * 100),
      },
    });
  });

  const order = await prismadb.order.create({
    data: {
      storeId: params.storeId,
      isPaid: false,
      orderItems: {
        create: orderedProducts.map((product) => {
          const randomDay = 2 + Math.random() * 2;
          const deliveryDate = new Date(
            new Date().getTime() + randomDay * 24 * 60 * 60 * 1000,
          );
          return {
            deliveryDate,
            quantity: product.quantity,
            product: {
              connect: { id: product.productId },
            },
          };
        }),
      },
    },
  });

  // Mobile
  if (isMobile) {
    const totalAmount = line_items.reduce(
      (total, product) =>
        total + product.price_data!.unit_amount! * product.quantity!,
      0,
    );

    /* 
    ? This is for the shipping address not implemented yet
    const shipping: Stripe.PaymentIntentCreateParams.Shipping = {
        name: billingData.name,
        address: {
            line1: billingData.address,
            line2: '',
            city: billingData.city,
            state: billingData.state,
            postal_code: billingData.zip,
            country: billingData.country,
          },
          phone: billingData.phone,
        };
    */

    const customer = await stripe.customers.create({
      name: billingData.name,
      email: billingData.email,
      phone: billingData.phone,
      address: {
        line1: billingData.address,
        postal_code: billingData.zip,
        city: billingData.city,
        state: billingData.state,
        country: billingData.country,
      },
      metadata: { orderId: order.id },
    });

    const paymentIntent = await stripe.paymentIntents.create({
      expand: ['payment_method'],
      amount: totalAmount,
      currency: 'usd',
      customer: customer.id,
      metadata: { orderId: order.id },
      payment_method_types: ['card'],
      description: 'Mobile Payment',
    });

    return NextResponse.json(paymentIntent, {
      status: 200,
      headers: corsHeaders,
    });
  }

  // Web
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    billing_address_collection: 'required',
    phone_number_collection: { enabled: true },
    line_items,
    mode: 'payment',
    allow_promotion_codes: true,
    success_url: `${storeUrl}/cart?success=${order.id}`,
    cancel_url: `${storeUrl}/cart?canceled=1`,
    metadata: { orderId: order.id, storeUrl },
  });

  return NextResponse.json({ url: session.url }, { headers: corsHeaders });
};
