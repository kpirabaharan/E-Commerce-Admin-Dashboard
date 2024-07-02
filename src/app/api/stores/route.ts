import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';

export const POST = async (req: Request) => {
  try {
    if (process.env.NODE_ENV === 'production') {
      return new NextResponse('Blocked Admin Routes for Demo', { status: 401 });
    }

    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }

    const { name, icon, color } = await req.json();

    if (!name) {
      return NextResponse.json('Name is Required', { status: 400 });
    }

    if (!icon) {
      return NextResponse.json('Icon is Required', { status: 400 });
    }

    if (!color) {
      return NextResponse.json('Color is Required', { status: 400 });
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
        data: { name, icon, color, userId },
      });

      return NextResponse.json(store, { status: 201 });
    }
  } catch (err) {
    console.log('[STORES_POST]:', err);
    return new NextResponse('Internal Error', { status: 500 });
  }
};
