import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

import prismadb from '@/lib/prismadb';

import SettingsForm from './components/SettingsForm';

interface SettingsPageProps {
  params: { storeId: string };
}

const SettingsPage = async ({ params }: SettingsPageProps) => {
  const { userId } = auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const store = await prismadb.store.findFirst({
    where: { id: params.storeId, userId },
  });

  const billboards = await prismadb.billboard.findMany({
    where: { storeId: params.storeId },
  });

  if (!store) {
    redirect('/');
  }

  return (
    <div className='flex flex-col'>
      <div className='flex-1 flex flex-col gap-y-4 p-8 pt-6'>
        <SettingsForm initialData={store} billboards={billboards} />
      </div>
    </div>
  );
};

export default SettingsPage;
