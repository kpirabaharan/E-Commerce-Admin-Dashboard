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

    if (!params.productId) {
      return NextResponse.json('Product Id is Required', { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: { id: params.storeId, userId },
    });

    if (!storeByUserId) {
      return NextResponse.json('Unauthorized', { status: 403 });
    }

    // const key = randomUUID();
    // var ext = imageName.split('.')[1];
    // ext === 'jpg' ? (ext = 'jpeg') : (ext = ext);
    // const updatedImageUrl =
    //   imageName === initialImageUrl ? imageName : `${key}.${ext}`;

    const product = await prismadb.product.update({
      where: { id: params.productId },
      data: {
        name,
        price,
        categoryId,
        sizeId,
        colorId,
        isFeatured,
        isArchived,
      },
    });

    // if (imageName !== initialImageUrl) {
    //   const s3DeleteParams = {
    //     Bucket: process.env.S3_PRODUCT_BUCKET ?? '',
    //     Key: initialImageUrl,
    //   };

    //   await s3.deleteObject(s3DeleteParams).promise();

    //   const s3PutParams = {
    //     Bucket: process.env.S3_PRODUCT_BUCKET ?? '',
    //     Key: updatedImageUrl,
    //     Expires: 60,
    //     ContentType: `image/${ext}`,
    //   };

    //   const uploadUrl = s3.getSignedUrl('putObject', s3PutParams);

    //   return NextResponse.json(
    //     { product, uploadUrl, message: 'Product Updated' },
    //     {
    //       status: 201,
    //     },
    //   );
    // } else {
    return NextResponse.json(
      { product, message: 'Product Updated' },
      {
        status: 200,
      },
    );
    // }
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
    });

    // const s3DeleteParams = {
    //   Bucket: process.env.S3_PRODUCT_BUCKET ?? '',
    //   Key: product.,
    // };

    // await s3.deleteObject(s3DeleteParams).promise();

    return NextResponse.json(
      { product, message: 'Product Deleted' },
      { status: 200 },
    );
  } catch (err) {
    console.log('[PRODUCT_DELETE]:', err);
    return new NextResponse('Internal Error', { status: 500 });
  }
};
