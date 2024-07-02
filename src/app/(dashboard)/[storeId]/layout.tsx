import { PropsWithChildren } from 'react';
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';

import Navbar from '@/components/Navbar';

interface RootLayoutProps extends PropsWithChildren {
  params: { storeId: string };
}

const RootLayout = async ({ children, params }: RootLayoutProps) => {
  const { userId } = auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
      userId,
    },
  });

  if (!store) {
    redirect('/');
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

export default RootLayout;
