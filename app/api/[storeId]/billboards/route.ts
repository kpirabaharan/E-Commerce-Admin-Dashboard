import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { randomUUID } from 'crypto';

import prismadb from '@/lib/prismadb';
import s3 from '@/lib/aws-client';

export const POST = async (
  req: Request,
  { params }: { params: { storeId: string } },
) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthorized User', { status: 401 });
    }

    const { label, imageName } = await req.json();

    if (!label) {
      return NextResponse.json('Label is Required', { status: 400 });
    }

    if (!imageName) {
      return NextResponse.json('Image URL is Required', { status: 400 });
    }

    if(!params.storeId){
      return NextResponse.json('Store Id is Required', { status: 400 });
    }

    const existingBillboard = await prismadb.billboard.findFirst({
      where: { label, storeId: params.storeId },
    });

    if (existingBillboard) {
      return NextResponse.json('A billboard with that name exists!', {
        status: 400,
      });
    } else {
      const key = randomUUID();

      const billboard = await prismadb.billboard.create({
        data: { label, imageUrl: key, storeId: params.storeId },
      });

      const ext = imageName.split('.')[1];

      const s3Params = {
        Bucket: process.env.S3_BUCKET,
        Key: `${key}.${ext}`,
        Expires: 60,
        ContentType: `image/${ext}`,
      };

      const uploadUrl = s3.getSignedUrl('putObject', s3Params);

      return NextResponse.json({ billboard, uploadUrl }, { status: 201 });
    }
  } catch (err) {
    console.log('[BILLBOARDS_POST]:', err);
    return new NextResponse('Internal Error', { status: 500 });
  }
};
