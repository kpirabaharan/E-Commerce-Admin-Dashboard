import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { randomUUID } from 'crypto';

import prismadb from '@/lib/prismadb';
import s3 from '@/lib/aws-client';

interface RequestProps {
  params: { storeId: string };
}

export const GET = async (req: Request, { params }: RequestProps) => {
  try {
    if (!params.storeId) {
      return NextResponse.json('Store Id is Required', { status: 400 });
    }

    const products = await prismadb.product.findMany({
      where: { storeId: params.storeId },
    });

    return NextResponse.json(products, { status: 200 });
  } catch (err) {
    console.log('[PRODUCTS_GET]:', err);
    return new NextResponse('Internal Error', { status: 500 });
  }
};

export const POST = async (req: Request, { params }: RequestProps) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }

    const {
      name,
      price,
      categoryId,
      sizeId,
      colorId,
      isFeatured,
      isArchived,
      type,
    } = await req.json();

    if (!name) {
      return NextResponse.json('Name is Required', { status: 400 });
    }

    if (!price) {
      return NextResponse.json('Price is Required', { status: 400 });
    }

    if (!categoryId) {
      return NextResponse.json('Category is Required', { status: 400 });
    }

    if (!sizeId) {
      return NextResponse.json('Size is Required', { status: 400 });
    }

    if (!colorId) {
      return NextResponse.json('Color is Required', { status: 400 });
    }

    if (!type) {
      return NextResponse.json('Image is Required', { status: 400 });
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

    const existingProduct = await prismadb.product.findFirst({
      where: { name, storeId: params.storeId },
    });
    if (existingProduct) {
      return NextResponse.json('A product with that name exists!', {
        status: 400,
      });
    }

    /* Create Random UUID for ImageURL (ensures storage on AWS) */
    const key = randomUUID();
    const ext = type.split('/')[1];
    const imageUrl = `${key}.${ext}`;

    const product = await prismadb.product.create({
      data: {
        name,
        price,
        categoryId,
        sizeId,
        colorId,
        isFeatured,
        isArchived,
        storeId: params.storeId,
      },
    });

    const s3Params = {
      Bucket: process.env.S3_BUCKET ?? '',
      Key: imageUrl,
      Expires: 60,
      ContentType: type,
    };

    const uploadUrl = s3.getSignedUrl('putObject', s3Params);

    return NextResponse.json(
      { product, uploadUrl, message: 'Billboard Created' },
      { status: 201 },
    );
  } catch (err) {
    console.log('[PRODUCTS_POST]:', err);
    return new NextResponse('Internal Error', { status: 500 });
  }
};
