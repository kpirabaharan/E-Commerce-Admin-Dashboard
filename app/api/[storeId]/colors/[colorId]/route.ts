import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';

interface RequestProps {
  params: { storeId: string; colorId: string };
}

export const GET = async (req: Request, { params }: RequestProps) => {
  try {
    if (!params.colorId) {
      return NextResponse.json('Color Id is Required', { status: 400 });
    }

    const color = await prismadb.color.findUnique({
      where: {
        id: params.colorId,
      },
    });

    return NextResponse.json(color, { status: 200 });
  } catch (err) {
    console.log('[COLOR_GET]:', err);
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

    if (!params.colorId) {
      return NextResponse.json('Color Id is Required', { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: { id: params.storeId, userId },
    });

    if (!storeByUserId) {
      return NextResponse.json('Unauthorized', { status: 403 });
    }

    const color = await prismadb.color.update({
      where: { id: params.colorId },
      data: { name, value },
    });

    return NextResponse.json(
      { color, message: 'Color Updated' },
      {
        status: 200,
      },
    );
  } catch (err) {
    console.log('[COLOR_PATCH]:', err);
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

    if (!params.colorId) {
      return NextResponse.json('Color Id is Required', { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: { id: params.storeId, userId },
    });

    if (!storeByUserId) {
      return NextResponse.json('Unauthorized', { status: 403 });
    }

    const color = await prismadb.color.delete({
      where: {
        id: params.colorId,
      },
    });

    return NextResponse.json(
      { color, message: 'Color Deleted' },
      { status: 200 },
    );
  } catch (err) {
    console.log('[COLOR_DELETE]:', err);
    return new NextResponse(
      'Please delete all products using this color first',
      { status: 400 },
    );
  }
};
