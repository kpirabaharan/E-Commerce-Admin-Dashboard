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

    const store = await prismadb.store.findUnique({
      where: {
        id: params.storeId,
      },
    });

    return NextResponse.json(store, {
      status: 200,
    });
  } catch (err) {
    console.log('[STORE_GET]:', err);
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

    const { name, limit, icon, color, homeBillboardId } = await req.json();

    if (!name) {
      return NextResponse.json('Name is Required', { status: 400 });
    }

    if (!limit) {
      return NextResponse.json('Limit is Required', { status: 400 });
    }

    if (!icon) {
      return NextResponse.json('Icon is Required', { status: 400 });
    }

    if (!color) {
      return NextResponse.json('Color is Required', { status: 400 });
    }

    if (!homeBillboardId) {
      return NextResponse.json('Home Billboard is Required', { status: 400 });
    }

    if (!params.storeId) {
      return NextResponse.json('Store Id is Required', { status: 400 });
    }

    console.log(homeBillboardId);

    const store = await prismadb.store.update({
      where: {
        id: params.storeId,
        userId,
      },
      data: {
        name,
        limit,
        icon,
        color,
        homeBillboardId,
      },
    });

    return NextResponse.json(
      { store, message: 'Store Updated' },
      {
        status: 200,
      },
    );
  } catch (err) {
    console.log('[STORE_PATCH]:', err);
    return new NextResponse('Internal Error', { status: 500 });
  }
};

export const DELETE = async (req: Request, { params }: RequestProps) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }

    if (!params.storeId) {
      return NextResponse.json('Store Id is Required', { status: 400 });
    }

    await prismadb.store.delete({
      where: {
        id: params.storeId,
        userId,
      },
    });

    return NextResponse.json({ message: 'Deleted Store' }, { status: 200 });
  } catch (err) {
    console.log('[STORE_DELETE]:', err);
    return new NextResponse('Please delete all products and categories first', {
      status: 400,
    });
  }
};
