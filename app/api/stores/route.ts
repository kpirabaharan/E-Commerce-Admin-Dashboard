import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

import { Store } from '@/types';
import prismadb from '@/lib/prismadb';

export const POST = async (req: Request) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthorized User', { status: 401 });
    }

    const { name } = await req.json();

    if (!name) {
      return NextResponse.json('Name is Required', { status: 400 });
    }

    const existingStore = await prismadb.store.findFirst({
      where: { name, userId },
    });

    if (existingStore) {
      return NextResponse.json('A store with that name exists!', {
        status: 400,
      });
    } else {
      const store = await prismadb.store.create({
        data: { name, userId },
      });

      return NextResponse.json(store, { status: 200 });
    }
  } catch (err) {
    console.log('[STORES_POST]:', err);
    return new NextResponse('Internal Error', { status: 500 });
  }
};
