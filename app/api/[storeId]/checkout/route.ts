import Stripe from 'stripe';
import { NextResponse } from 'next/server';

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

export const POST = async (req: Request, { params }: RequestProps) => {
  const { productIds, storeUrl }: { productIds: string[]; storeUrl: string } =
    await req.json();

  if (!productIds || productIds.length === 0) {
    return new NextResponse('Product ids are required', { status: 400 });
  }

  if (!storeUrl) {
    return new NextResponse('Store Url is required', { status: 400 });
  }

  const products = await prismadb.product.findMany({
    where: { id: { in: productIds } },
    include: { images: true },
  });

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  products.forEach((product) => {
    line_items.push({
      quantity: 1,
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
        create: productIds.map((productId: string) => ({
          product: {
            connect: { id: productId },
          },
        })),
      },
    },
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    billing_address_collection: 'required',
    phone_number_collection: { enabled: true },
    line_items,
    mode: 'payment',
    allow_promotion_codes: true,
    success_url: `${storeUrl}/cart?success=1`,
    cancel_url: `${storeUrl}/cart?canceled=1`,
    metadata: { orderId: order.id },
  });

  return NextResponse.json({ url: session.url }, { headers: corsHeaders });
};
