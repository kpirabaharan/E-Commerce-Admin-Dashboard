import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { Prisma } from '@prisma/client';
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
    if (process.env.NODE_ENV === 'production') {
      return new NextResponse('Blocked Admin Routes for Demo', { status: 401 });
    }

    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }

    const {
      name,
      price,
      amount,
      categoryId,
      sizeId,
      colorId,
      isFeatured,
      isArchived,
      newImages,
    }: {
      name: string;
      price: number;
      amount: number;
      categoryId: string;
      sizeId: string;
      colorId: string;
      isFeatured: boolean;
      isArchived: boolean;
      newImages: { type: string }[];
    } = await req.json();

    if (!name) {
      return NextResponse.json('Name is Required', { status: 400 });
    }

    if (newImages.length == 0) {
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

    /* Create Random UUID for ImageURL (ensures storage on AWS) */
    const newImageKeys = newImages.map((image) => ({
      key: `${randomUUID()}.${image.type.split('/')[1]}`,
      type: image.type,
    }));

    const product = await prismadb.product.create({
      data: {
        name,
        price: new Prisma.Decimal(price),
        amount,
        categoryId,
        sizeId,
        colorId,
        isFeatured,
        isArchived,
        storeId: params.storeId,
        images: {
          createMany: {
            data: newImageKeys.map((image) => ({
              key: image.key,
              url: `https://ecommerce-admin-kpirabaharan-products.s3.amazonaws.com/${image.key}`,
            })),
          },
        },
      },
    });

    /* Created New Image URLs */
    const S3Params = newImageKeys.map((image) => ({
      Bucket: process.env.S3_PRODUCT_BUCKET ?? '',
      Key: image.key,
      Expires: 60,
      ContentType: image.type,
      ACL: 'public-read',
    }));

    const uploadUrls = S3Params.map((S3Param) =>
      s3.getSignedUrl('putObject', S3Param),
    );

    return NextResponse.json(
      { product, uploadUrls, message: 'Product Created' },
      { status: 201 },
    );
  } catch (err) {
    console.log('[PRODUCTS_POST]:', err);
    return new NextResponse('Internal Error', { status: 500 });
  }
};
