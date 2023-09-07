import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { randomUUID } from 'crypto';

import prismadb from '@/lib/prismadb';
import s3 from '@/lib/aws-client';

interface RequestProps {
  params: { storeId: string; billboardId: string };
}

export const GET = async (req: Request, { params }: RequestProps) => {
  try {
    if (!params.billboardId) {
      return NextResponse.json('Billboard Id is Required', { status: 400 });
    }

    const billboard = await prismadb.billboard.findUnique({
      where: {
        id: params.billboardId,
      },
    });

    return NextResponse.json(billboard, { status: 200 });
  } catch (err) {
    console.log('[BILLBOARD_GET]:', err);
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

    const { label, oldImage, deletedImage, newImage } = await req.json();

    if (!label) {
      return NextResponse.json('Label is Required', { status: 400 });
    }

    if (!oldImage && !newImage) {
      return NextResponse.json('Image is Required', { status: 400 });
    }

    if (!params.billboardId) {
      return NextResponse.json('Billboard Id is Required', { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: { id: params.storeId, userId },
    });

    if (!storeByUserId) {
      return NextResponse.json('Unauthorized', { status: 403 });
    }

    const imageData = newImage
      ? {
          key: `${randomUUID()}.${newImage.type.split('/')[1]}`,
          type: newImage.type,
        }
      : { key: oldImage.key };

    const billboard = await prismadb.billboard.update({
      where: { id: params.billboardId },
      data: {
        label,
        imageKey: imageData.key,
        imageUrl: `https://ecommerce-admin-kpirabaharan-billboards.s3.amazonaws.com/${imageData.key}`,
      },
    });

    /* Deleted Old Image (Not Used Anymore) */
    if (newImage) {
      const S3DeleteParam = {
        Bucket: process.env.S3_BILLBOARD_BUCKET ?? '',
        Key: deletedImage.key,
      };

      await s3.deleteObject(S3DeleteParam).promise();
    }

    /* Replace with New Image */
    const S3Param = {
      Bucket: process.env.S3_BILLBOARD_BUCKET ?? '',
      Key: imageData.key,
      Expires: 60,
      ContentType: imageData.type,
    };

    const uploadUrl = s3.getSignedUrl('putObject', S3Param);
    return NextResponse.json(
      { billboard, uploadUrl, message: 'Billboard Updated' },
      newImage
        ? {
            status: 201,
          }
        : { status: 200 },
    );
  } catch (err) {
    console.log('[BILLBOARD_PATCH]:', err);
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

    if (!params.billboardId) {
      return NextResponse.json('Billboard Id is Required', { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: { id: params.storeId, userId },
    });

    if (!storeByUserId) {
      return NextResponse.json('Unauthorized', { status: 403 });
    }

    const billboard = await prismadb.billboard.delete({
      where: {
        id: params.billboardId,
      },
    });

    const S3DeleteParams = {
      Bucket: process.env.S3_BILLBOARD_BUCKET ?? '',
      Key: billboard.imageKey,
    };

    await s3.deleteObject(S3DeleteParams).promise();

    return NextResponse.json(
      { billboard, message: 'Billboard Deleted' },
      { status: 200 },
    );
  } catch (err) {
    console.log('[BILLBOARD_DELETE]:', err);
    return new NextResponse(
      'Please delete all categories using this billboard first',
      { status: 400 },
    );
  }
};
