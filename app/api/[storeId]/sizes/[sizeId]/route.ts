import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';

interface RequestProps {
  params: { storeId: string; sizeId: string };
}

export const GET = async (req: Request, { params }: RequestProps) => {
  try {
    if (!params.sizeId) {
      return NextResponse.json('Size Id is Required', { status: 400 });
    }

    const size = await prismadb.size.findUnique({
      where: {
        id: params.sizeId,
      },
    });

    return NextResponse.json(size, { status: 200 });
  } catch (err) {
    console.log('[SIZE_GET]:', err);
    return new NextResponse('Internal Error', { status: 500 });
  }
};

export const PATCH = async (req: Request, { params }: RequestProps) => {
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

    if (!params.sizeId) {
      return NextResponse.json('Size Id is Required', { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: { id: params.storeId, userId },
    });

    if (!storeByUserId) {
      return NextResponse.json('Unauthorized', { status: 403 });
    }

    const size = await prismadb.size.update({
      where: { id: params.sizeId },
      data: { name, value },
    });

    return NextResponse.json(
      { size, message: 'Size Updated' },
      {
        status: 200,
      },
    );
  } catch (err) {
    console.log('[SIZE_PATCH]:', err);
    return new NextResponse('Internal Error', { status: 500 });
  }
};

export const DELETE = async (req: Request, { params }: RequestProps) => {
  try {
    if (process.env.NODE_ENV === 'production') {
      return new NextResponse('Blocked Admin Routes for Demo', { status: 401 });
    }

    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }

    if (!params.sizeId) {
      return NextResponse.json('Size Id is Required', { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: { id: params.storeId, userId },
    });

    if (!storeByUserId) {
      return NextResponse.json('Unauthorized', { status: 403 });
    }

    const size = await prismadb.size.delete({
      where: {
        id: params.sizeId,
      },
    });

    return NextResponse.json(
      { size, message: 'Size Deleted' },
      { status: 200 },
    );
  } catch (err) {
    console.log('[SIZE_DELETE]:', err);
    return new NextResponse(
      'Please delete all products using this size first',
      { status: 400 },
    );
  }
};
