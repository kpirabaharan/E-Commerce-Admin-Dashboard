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
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('categoryId') || undefined;
    const sizeId = searchParams.get('sizeId') || undefined;
    const colorId = searchParams.get('colorId') || undefined;
    const isFeatured = searchParams.get('isFeatured');

    if (!params.storeId) {
      return NextResponse.json('Store Id is Required', { status: 400 });
    }

    const products = await prismadb.product.findMany({
      where: {
        storeId: params.storeId,
        categoryId,
        sizeId,
        colorId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
      },
      include: { images: true, category: true, size: true, color: true },
      orderBy: { createdAt: 'desc' },
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
      types,
    }: {
      name: string;
      price: number;
      categoryId: string;
      sizeId: string;
      colorId: string;
      isFeatured: boolean;
      isArchived: boolean;
      types: string[];
    } = await req.json();

    console.log({
      name,
      price,
      categoryId,
      sizeId,
      colorId,
      isFeatured,
      isArchived,
      types,
    });

    if (!name) {
      return NextResponse.json('Name is Required', { status: 400 });
    }

    if (!types) {
      return NextResponse.json('Atleast One Image is Required', {
        status: 400,
      });
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
    const imageUrls = types.map((type) => {
      const key = randomUUID();
      console.log({ key });
      const ext = type.split('/')[1];
      return `${key}.${ext}`;
    });

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
        images: {
          createMany: {
            data: imageUrls.map((imageUrl) => ({ url: imageUrl })),
          },
        },
      },
    });

    const S3Params = imageUrls.map((imageUrl) => ({
      Bucket: process.env.S3_PRODUCT_BUCKET ?? '',
      Key: imageUrl,
      Expires: 60,
      ContentType: `image/${imageUrl.split('.')[1]}`,
    }));
    console.log({ S3Params });

    const uploadUrls = S3Params.map((S3Param) =>
      s3.getSignedUrl('putObject', S3Param),
    );

    console.log({ product });
    console.log({ uploadUrls });

    return NextResponse.json(
      { product, uploadUrls, message: 'Product Created' },
      { status: 201 },
    );
  } catch (err) {
    console.log('[PRODUCTS_POST]:', err);
    return new NextResponse('Internal Error', { status: 500 });
  }
};
