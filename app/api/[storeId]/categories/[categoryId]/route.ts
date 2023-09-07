import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';

interface RequestProps {
  params: { storeId: string; categoryId: string };
}

export const GET = async (req: Request, { params }: RequestProps) => {
  try {
    if (!params.categoryId) {
      return NextResponse.json('Category Id is Required', { status: 400 });
    }

    const category = await prismadb.category.findUnique({
      where: {
        id: params.categoryId,
      },
      include: { billboard: true },
    });

    return NextResponse.json(category, { status: 200 });
  } catch (err) {
    console.log('[CATEGORY_GET]:', err);
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

    const { name, billboardId } = await req.json();

    if (!name) {
      return NextResponse.json('Name is Required', { status: 400 });
    }

    if (!billboardId) {
      return NextResponse.json('Billboard id is Required', { status: 400 });
    }

    if (!params.categoryId) {
      return NextResponse.json('Category Id is Required', { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: { id: params.storeId, userId },
    });

    if (!storeByUserId) {
      return NextResponse.json('Unauthorized', { status: 403 });
    }

    const category = await prismadb.category.update({
      where: { id: params.categoryId },
      data: { name, billboardId },
    });

    return NextResponse.json(
      { category, message: 'Category Updated' },
      {
        status: 200,
      },
    );
  } catch (err) {
    console.log('[CATEGORY_PATCH]:', err);
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

    if (!params.categoryId) {
      return NextResponse.json('Category Id is Required', { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: { id: params.storeId, userId },
    });

    if (!storeByUserId) {
      return NextResponse.json('Unauthorized', { status: 403 });
    }

    const category = await prismadb.category.delete({
      where: {
        id: params.categoryId,
      },
    });

    return NextResponse.json(
      { category, message: 'Category Deleted' },
      { status: 200 },
    );
  } catch (err) {
    console.log('[CATEGORY_DELETE]:', err);
    return new NextResponse('Internal Error', { status: 500 });
  }
};
