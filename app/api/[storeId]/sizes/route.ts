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

    const sizes = await prismadb.size.findMany({
      where: { storeId: params.storeId },
    });

    return NextResponse.json(sizes, { status: 200 });
  } catch (err) {
    console.log('[SIZES_GET]:', err);
    return new NextResponse('Internal Error', { status: 500 });
  }
};

export const POST = async (req: Request, { params }: RequestProps) => {
  try {
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

    const existingSize = await prismadb.size.findFirst({
      where: { name, storeId: params.storeId },
    });

    if (existingSize) {
      return NextResponse.json('A size with that name exists!', {
        status: 400,
      });
    }

    const size = await prismadb.size.create({
      data: { name, value, storeId: params.storeId },
    });

    return NextResponse.json(
      { size, message: 'Size Created' },
      { status: 201 },
    );
  } catch (err) {
    console.log('[SIZE_POST]:', err);
    return new NextResponse('Internal Error', { status: 500 });
  }
};
