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
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }

    const { label, imageName, initialImageUrl } = await req.json();

    if (!label) {
      return NextResponse.json('Label is Required', { status: 400 });
    }

    if (!imageName) {
      return NextResponse.json('Image URL is Required', { status: 400 });
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

    const key = randomUUID();
    var ext = imageName.split('.')[1];
    ext === 'jpg' ? (ext = 'jpeg') : (ext = ext);
    const updatedImageUrl =
      imageName === initialImageUrl ? imageName : `${key}.${ext}`;

    const billboard = await prismadb.billboard.update({
      where: { id: params.billboardId },
      data: { label, imageUrl: updatedImageUrl },
    });

    if (imageName !== initialImageUrl) {
      const s3DeleteParams = {
        Bucket: process.env.S3_BUCKET ?? '',
        Key: initialImageUrl,
      };

      await s3.deleteObject(s3DeleteParams).promise();

      const s3PutParams = {
        Bucket: process.env.S3_BUCKET ?? '',
        Key: updatedImageUrl,
        Expires: 60,
        ContentType: `image/${ext}`,
      };

      const uploadUrl = s3.getSignedUrl('putObject', s3PutParams);

      return NextResponse.json(
        { billboard, uploadUrl, message: 'Billboard Updated' },
        {
          status: 201,
        },
      );
    } else {
      return NextResponse.json(
        { billboard, message: 'Billboard Updated' },
        {
          status: 200,
        },
      );
    }
  } catch (err) {
    console.log('[BILLBOARD_PATCH]:', err);
    return new NextResponse('Internal Error', { status: 500 });
  }
};

export const DELETE = async (req: Request, { params }: RequestProps) => {
  try {
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

    const s3DeleteParams = {
      Bucket: process.env.S3_BUCKET ?? '',
      Key: billboard.imageUrl,
    };

    await s3.deleteObject(s3DeleteParams).promise();

    return NextResponse.json(
      { billboard, message: 'Billboard Deleted' },
      { status: 200 },
    );
  } catch (err) {
    console.log('[BILLBOARD_DELETE]:', err);
    return new NextResponse('Internal Error', { status: 500 });
  }
};
