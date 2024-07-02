import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';

interface RequestProps {
  params: { userId: string };
}

export const GET = async (req: Request, { params }: RequestProps) => {
  try {
    if (!params.userId) {
      return NextResponse.json('User Id is Required', { status: 400 });
    }

    const stores = await prismadb.store.findMany({
      where: { userId: params.userId },
    });

    return NextResponse.json(stores, { status: 200 });
  } catch (err) {
    console.log('[STORES_GET]:', err);
    return new NextResponse('Internal Error', { status: 500 });
  }
};
