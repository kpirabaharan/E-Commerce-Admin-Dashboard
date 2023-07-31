import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';

export const POST = async (
  req: Request,
  { params }: { params: { storeId: string } },
) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthorized User', { status: 401 });
    }

    const { label, imageUrl } = await req.json();

    console.log(label, imageUrl);
    console.log(params.storeId);

    if (!label) {
      return NextResponse.json('Label is Required', { status: 400 });
    }

    if (!imageUrl) {
      return NextResponse.json('Image URL is Required', { status: 400 });
    }

    const existingBillboard = await prismadb.billboard.findFirst({
      where: { label, storeId: params.storeId },
    });

    if (existingBillboard) {
      return NextResponse.json('A billboard with that name exists!', {
        status: 400,
      });
    } else {
      const billboard = await prismadb.billboard.create({
        data: { label, imageUrl, storeId: params.storeId },
      });

      return NextResponse.json(billboard, { status: 201 });
    }
  } catch (err) {
    console.log('[STORES_POST]:', err);
    return new NextResponse('Internal Error', { status: 500 });
  }
};
