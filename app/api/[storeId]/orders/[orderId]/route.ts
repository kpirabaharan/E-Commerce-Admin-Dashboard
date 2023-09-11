import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';

interface RequestProps {
  params: { storeId: string; orderId: string };
}

export const GET = async (req: Request, { params }: RequestProps) => {
  try {
    if (!params.orderId) {
      return NextResponse.json('Order Id is Required', { status: 400 });
    }

    const order = await prismadb.order.findUnique({
      where: {
        id: params.orderId,
      },
      include: {
        orderItems: {
          include: { product: { include: { images: true } } },
        },
        store: { select: { name: true } },
      },
    });

    // if (order) {
    //   order.createdAt = format(order?.createdAt, 'MMMM do, yyyy');
    // }

    return NextResponse.json(order, { status: 200 });
  } catch (err) {
    console.log('[ORDER_GET]:', err);
    return new NextResponse('Internal Error', { status: 500 });
  }
};
