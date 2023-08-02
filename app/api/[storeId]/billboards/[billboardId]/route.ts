import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

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

    return NextResponse.json(
      { billboard, message: 'Fetched Billboard' },
      { status: 200 },
    );
  } catch (err) {
    console.log('[STORE_GET]:', err);
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

    const ext = imageName.split('.')[1];
    const updatedImageUrl = `${initialImageUrl.split('.')[0]}.${ext}`;

    console.log(updatedImageUrl);

    const billboard = await prismadb.billboard.update({
      where: { id: params.billboardId },
      data: { label, imageUrl: updatedImageUrl },
    });

    // const s3Params = {
    //   Bucket: process.env.S3_BUCKET ?? '',
    //   Key: `${key}.${ext}`,
    //   Expires: 60,
    //   ContentType: `image/${ext}`,
    // };

    // const uploadUrl = s3.getSignedUrl('putObject', s3Params);

    return NextResponse.json(
      { billboard, message: 'Updated Billboard' },
      {
        status: 200,
      },
    );
  } catch (err) {
    console.log('[STORE_PATCH]:', err);
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

    await prismadb.billboard.delete({
      where: {
        id: params.billboardId,
      },
    });

    return NextResponse.json({ message: 'Deleted Billboard' }, { status: 200 });
  } catch (err) {
    console.log('[STORE_DELETE]:', err);
    return new NextResponse('Internal Error', { status: 500 });
  }
};
