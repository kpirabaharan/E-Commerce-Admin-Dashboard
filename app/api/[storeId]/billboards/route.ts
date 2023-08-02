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
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }

    if (!params.storeId) {
      return NextResponse.json('Store Id is Required', { status: 400 });
    }

    const billboards = await prismadb.billboard.findMany({
      where: { storeId: params.storeId },
    });

    return NextResponse.json(billboards, { status: 200 });
  } catch (err) {
    console.log('[BILLBOARDS_GET]:', err);
    return new NextResponse('Internal Error', { status: 500 });
  }
};

export const POST = async (req: Request, { params }: RequestProps) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }

    const { label, imageName } = await req.json();

    if (!label) {
      return NextResponse.json('Label is Required', { status: 400 });
    }

    if (!imageName) {
      return NextResponse.json('Image URL is Required', { status: 400 });
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

    const existingBillboard = await prismadb.billboard.findFirst({
      where: { label, storeId: params.storeId },
    });

    if (existingBillboard) {
      return NextResponse.json('A billboard with that name exists!', {
        status: 400,
      });
    }

    /* Create Random UUID for ImageURL (ensures storage on AWS) */
    const key = randomUUID();
    const ext = imageName.split('.')[1];
    const imageUrl = `${key}.${ext}`;

    const billboard = await prismadb.billboard.create({
      data: { label, imageUrl, storeId: params.storeId },
    });

    const s3Params = {
      Bucket: process.env.S3_BUCKET ?? '',
      Key: imageUrl,
      Expires: 60,
      ContentType: `image/${ext}`,
    };

    const uploadUrl = s3.getSignedUrl('putObject', s3Params);

    return NextResponse.json({ billboard, uploadUrl }, { status: 201 });
  } catch (err) {
    console.log('[BILLBOARDS_POST]:', err);
    return new NextResponse('Internal Error', { status: 500 });
  }
};
