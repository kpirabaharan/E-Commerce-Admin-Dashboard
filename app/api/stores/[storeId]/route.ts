import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';

interface RequestProps {
  params: { storeId: string };
}

export const PATCH = async (req: Request, { params }: RequestProps) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthorized User', { status: 401 });
    }

    const { name, icon } = await req.json();

    if (!name) {
      return NextResponse.json('Name is Required', { status: 400 });
    }

    if (!params.storeId) {
      return NextResponse.json('Store Id is Required', { status: 400 });
    }

    const store = await prismadb.store.update({
      where: {
        id: params.storeId,
        userId,
      },
      data: {
        icon,
        name,
      },
    });

    return NextResponse.json(
      { store, message: 'Store Name Updated' },
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
      return new NextResponse('Unauthorized User', { status: 401 });
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
    return new NextResponse('Internal Error', { status: 500 });
  }
};
