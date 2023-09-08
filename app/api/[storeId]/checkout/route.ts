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
  amount: number;
}

export const POST = async (req: Request, { params }: RequestProps) => {
  const {
    orderedProducts,
    storeUrl,
  }: { orderedProducts: orderedProduct[]; storeUrl: string } = await req.json();

  console.log({ orderedProducts });

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

  console.log({ products });

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  products.forEach((product) => {
    const selectedProduct = orderedProducts.find(
      (orderedProduct) => orderedProduct.productId === product.id,
    );

    line_items.push({
      quantity: selectedProduct?.amount ?? 1,
      price_data: {
        currency: 'USD',
        product_data: { name: product.name, images: [product.images[0].url] },
        unit_amount: Math.round(Number(product.price) * 100),
      },
    });
  });

  console.log({ line_items });

  const order = await prismadb.order.create({
    data: {
      storeId: params.storeId,
      isPaid: false,
      orderItems: {
        create: orderedProducts.map((product) => ({
          amount: product.amount,
          product: {
            connect: { id: product.productId },
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
