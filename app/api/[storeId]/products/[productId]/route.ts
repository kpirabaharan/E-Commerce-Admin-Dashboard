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
      imageNames,
      initialImageUrls,
    }: {
      name: string;
      price: number;
      categoryId: string;
      sizeId: string;
      colorId: string;
      isFeatured: boolean;
      isArchived: boolean;
      imageNames: string[];
      initialImageUrls: string[];
    } = await req.json();

    console.log({ imageNames, initialImageUrls });

    if (!name) {
      return NextResponse.json('Name is Required', { status: 400 });
    }

    if (!imageNames) {
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

    const updatedImageUrls = imageNames.map((imageName) => {
      return initialImageUrls.includes(imageName)
        ? { url: imageName, oldUrl: imageName, changed: false }
        : {
            url: `${randomUUID()}.${imageName.split('.')[1]}`,
            oldUrl: imageName,
            changed: true,
          };
    });

    console.log({ updatedImageUrls });

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
            data: updatedImageUrls.map((imageUrl) => ({ url: imageUrl.url })),
          },
        },
      },
    });

    const deletedImages = initialImageUrls.filter(
      (initialImageUrl) => !imageNames.includes(initialImageUrl),
    );

    console.log({ deletedImages });

    deletedImages.map(async (deletedImage) => {
      const s3DeleteParams = {
        Bucket: process.env.S3_PRODUCT_BUCKET ?? '',
        Key: deletedImage,
      };

      await s3.deleteObject(s3DeleteParams).promise();
    });

    console.log({ updatedImageUrls });

    updatedImageUrls.map(async (updatedImage) => {
      if (updatedImage.changed) {
        const s3DeleteParams = {
          Bucket: process.env.S3_PRODUCT_BUCKET ?? '',
          Key: updatedImage.oldUrl,
        };

        await s3.deleteObject(s3DeleteParams).promise();
      }
    });

    const updatedImages = updatedImageUrls.filter(
      (imageUrl) => imageUrl.changed,
    );

    const uploadUrls = updatedImages.map((updatedImage) => {
      const s3PutParams = {
        Bucket: process.env.S3_BILLBOARD_BUCKET ?? '',
        Key: updatedImage.url,
        Expires: 60,
        ContentType: `image/${updatedImage.url.split('.')[1]}`,
      };

      return s3.getSignedUrl('putObject', s3PutParams);
    });

    console.log({ uploadUrls });

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
      Key: image.url,
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
