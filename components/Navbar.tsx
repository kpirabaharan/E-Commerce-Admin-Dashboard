import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';

import NavRoutes from '@/components/NavRoutes';
import StoreSwitcher from '@/components/StoreSwitcher';
import ClerkButton from '@/components/ClerkButton';

const Navbar = async () => {
  const { userId } = auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const stores = await prismadb.store.findMany({ where: { userId } });

  return (
    <div className='flex flex-row items-center h-16 px-4 gap-x-4 border-b'>
      <StoreSwitcher items={stores} />
      <NavRoutes />
      <div className='ml-auto'>
        <ClerkButton />
      </div>
    </div>
  );
};

export default Navbar;
