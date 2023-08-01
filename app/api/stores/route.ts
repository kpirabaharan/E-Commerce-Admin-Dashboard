import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';

export const POST = async (req: Request) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }

    const { name, icon } = await req.json();

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
        data: { name, icon, userId },
      });

      return NextResponse.json(store, { status: 201 });
    }
  } catch (err) {
    console.log('[STORES_POST]:', err);
    return new NextResponse('Internal Error', { status: 500 });
  }
};
