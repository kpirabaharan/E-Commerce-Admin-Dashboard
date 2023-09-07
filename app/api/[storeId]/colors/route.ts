import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';

interface RequestProps {
  params: { storeId: string };
}

export const GET = async (req: Request, { params }: RequestProps) => {
  try {
    if (!params.storeId) {
      return NextResponse.json('Store Id is Required', { status: 400 });
    }

    const colors = await prismadb.color.findMany({
      where: { storeId: params.storeId },
    });

    return NextResponse.json(colors, { status: 200 });
  } catch (err) {
    console.log('[COLORS_GET]:', err);
    return new NextResponse('Internal Error', { status: 500 });
  }
};

export const POST = async (req: Request, { params }: RequestProps) => {
  try {
    if (process.env.NODE_ENV === 'production') {
      return new NextResponse('Blocked Admin Routes for Demo', { status: 401 });
    }
    
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }

    const { name, value } = await req.json();

    if (!name) {
      return NextResponse.json('Name is Required', { status: 400 });
    }

    if (!value) {
      return NextResponse.json('Value is Required', { status: 400 });
    }

    if (!params.storeId) {
      return NextResponse.json('Store Id is Required', { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: { id: params.storeId, userId },
    });

    if (!storeByUserId) {
      return NextResponse.json('Unauthorized', { status: 403 });
    }

    const existingColor = await prismadb.color.findFirst({
      where: { name, storeId: params.storeId },
    });

    if (existingColor) {
      return NextResponse.json('A color with that name exists!', {
        status: 400,
      });
    }

    const color = await prismadb.color.create({
      data: { name, value, storeId: params.storeId },
    });

    return NextResponse.json(
      { color, message: 'Color Created' },
      { status: 201 },
    );
  } catch (err) {
    console.log('[COLOR_POST]:', err);
    return new NextResponse('Internal Error', { status: 500 });
  }
};
