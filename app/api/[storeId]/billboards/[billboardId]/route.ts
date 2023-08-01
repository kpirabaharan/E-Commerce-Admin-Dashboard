import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';

interface RequestProps {
  params: { storeId: string; billboardId: string };
}

export const PATCH = async (req: Request, { params }: RequestProps) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }

    const { label, imageName } = await req.json();

    if (!label) {
      return NextResponse.json('Label is Required', { status: 400 });
    }

    if (!imageName) {
      return NextResponse.json('Image URL is Required', { status: 400 });
    }

    if (!params.billboardId) {
      return NextResponse.json('Billboard Id is Required', { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: { id: params.storeId, userId },
    });

    if (!storeByUserId) {
      return NextResponse.json('Unauthorized', { status: 403 });
    }

    const billboard = await prismadb.billboard.update({
      where: { id: params.billboardId },
      data: { label },
    });

    return NextResponse.json(
      { billboard, message: 'Billboard Name Updated' },
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
    return new NextResponse('Internal Error', { status: 500 });
  }
};
