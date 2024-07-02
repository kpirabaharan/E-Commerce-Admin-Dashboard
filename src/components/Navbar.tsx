import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';

import NavRoutes from '@/components/NavRoutes';
import StoreSwitcher from '@/components/StoreSwitcher';
import ClerkButton from '@/components/ClerkButton';
import ThemeButton from '@/components/ThemeButton';

const Navbar = async () => {
  const { userId } = auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const stores = await prismadb.store.findMany({ where: { userId } });

  return (
    <div className='flex flex-row justify-between items-center h-16 px-4 gap-x-4 border-b'>
      <StoreSwitcher items={stores} />
      <NavRoutes />
      <div className='flex flex-row gap-x-4 items-center lg:ml-auto'>
        <ThemeButton />
        <ClerkButton />
      </div>
    </div>
  );
};

export default Navbar;
