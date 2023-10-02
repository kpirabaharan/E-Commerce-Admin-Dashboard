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

    const categories = await prismadb.category.findMany({
      where: { storeId: params.storeId },
    });

    return NextResponse.json(categories, { status: 200 });
  } catch (err) {
    console.log('[CATEGORIES_GET]:', err);
    return new NextResponse('Internal Error', { status: 500 });
  }
};

export const POST = async (req: Request, { params }: RequestProps) => {
  try {
    if (process.env.NODE_ENV === 'production') {
      return new NextResponse('Blocked Admin Routes for Demo', { status: 401 });
    }

    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }

    const { name, billboardId } = await req.json();

    if (!name) {
      return NextResponse.json('Name is Required', { status: 400 });
    }

    if (!billboardId) {
      return NextResponse.json('Billboard id is Required', { status: 400 });
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

    const existingCategory = await prismadb.category.findFirst({
      where: { name, storeId: params.storeId },
    });

    if (existingCategory) {
      return NextResponse.json('A category with that name exists!', {
        status: 400,
      });
    }

    const category = await prismadb.category.create({
      data: { name, billboardId, storeId: params.storeId },
    });

    return NextResponse.json(
      { category, message: 'Category Created' },
      { status: 201 },
    );
  } catch (err) {
    console.log('[CATEGORY_POST]:', err);
    return new NextResponse('Internal Error', { status: 500 });
  }
};
