import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { randomUUID } from 'crypto';

import prismadb from '@/lib/prismadb';
import s3 from '@/lib/aws-client';

interface RequestProps {
  params: { storeId: string; productId: string };
}

export const GET = async (req: Request, { params }: RequestProps) => {
  try {
    if (!params.productId) {
      return NextResponse.json('Product Id is Required', { status: 400 });
    }

    const product = await prismadb.product.findUnique({
      where: {
        id: params.productId,
      },
      include: { images: true, category: true, size: true, color: true },
    });

    return NextResponse.json(product, { status: 200 });
  } catch (err) {
    console.log('[PRODUCT_GET]:', err);
    return new NextResponse('Internal Error', { status: 500 });
  }
};

export const PATCH = async (req: Request, { params }: RequestProps) => {
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
      oldImages,
      deletedImages,
      newImages,
    }: {
      name: string;
      price: number;
      categoryId: string;
      sizeId: string;
      colorId: string;
      isFeatured: boolean;
      isArchived: boolean;
      oldImages: { key: string }[];
      deletedImages: { key: string }[];
      newImages: { type: string }[];
    } = await req.json();

    if (!name) {
      return NextResponse.json('Name is Required', { status: 400 });
    }

    if (0 == oldImages.length + newImages.length) {
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

    if (!params.productId) {
      return NextResponse.json('Product Id is Required', { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: { id: params.storeId, userId },
    });

    if (!storeByUserId) {
      return NextResponse.json('Unauthorized', { status: 403 });
    }

    const newImageKeys = newImages.map((image) => ({
      key: `${randomUUID()}.${image.type.split('/')[1]}`,
      type: image.type,
    }));

    await prismadb.product.update({
      where: { id: params.productId },
      data: {
        name,
        price,
        categoryId,
        sizeId,
        colorId,
        isFeatured,
        isArchived,
        images: { deleteMany: {} },
      },
    });

    const product = await prismadb.product.update({
      where: { id: params.productId },
      data: {
        images: {
          createMany: {
            data: [
              ...oldImages.map((image) => ({
                key: image.key,
                url: `https://ecommerce-admin-kpirabaharan-products.s3.amazonaws.com/${image.key}`,
              })),
              ...newImageKeys.map((image) => ({
                key: image.key,
                url: `https://ecommerce-admin-kpirabaharan-products.s3.amazonaws.com/${image.key}`,
              })),
            ],
          },
        },
      },
    });

    /* Deleted Old Images (Not Used Anymore) */
    deletedImages.forEach(async (image) => {
      const S3DeleteParams = {
        Bucket: process.env.S3_PRODUCT_BUCKET ?? '',
        Key: image.key,
      };

      await s3.deleteObject(S3DeleteParams).promise();
    });

    /* Created New Image URLs */
    const S3Params = newImageKeys.map((image) => ({
      Bucket: process.env.S3_PRODUCT_BUCKET ?? '',
      Key: image.key,
      Expires: 60,
      ContentType: image.type,
    }));

    const uploadUrls = S3Params.map((S3Param) =>
      s3.getSignedUrl('putObject', S3Param),
    );

    return NextResponse.json(
      { product, uploadUrls, message: 'Product Updated' },
      uploadUrls.length === 0
        ? {
            status: 200,
          }
        : {
            status: 201,
          },
    );
  } catch (err) {
    console.log('[PRODUCT_PATCH]:', err);
    return new NextResponse('Internal Error', { status: 500 });
  }
};

export const DELETE = async (req: Request, { params }: RequestProps) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }

    if (!params.productId) {
      return NextResponse.json('Product Id is Required', { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: { id: params.storeId, userId },
    });

    if (!storeByUserId) {
      return NextResponse.json('Unauthorized', { status: 403 });
    }

    const product = await prismadb.product.delete({
      where: {
        id: params.productId,
      },
      include: { images: true },
    });

    const S3DeleteParams = product.images.map((image) => ({
      Bucket: process.env.S3_PRODUCT_BUCKET ?? '',
      Key: image.key,
    }));

    S3DeleteParams.map(
      async (S3DeleteParam) => await s3.deleteObject(S3DeleteParam).promise(),
    );

    return NextResponse.json(
      { product, message: 'Product Deleted' },
      { status: 200 },
    );
  } catch (err) {
    console.log('[PRODUCT_DELETE]:', err);
    return new NextResponse('Internal Error', { status: 500 });
  }
};
