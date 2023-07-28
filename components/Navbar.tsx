import { redirect } from 'next/navigation';
import { UserButton, auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';

import NavRoutes from '@/components/NavRoutes';
import StoreSwitcher from '@/components/StoreSwitcher';

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
      <div className='ml-auto flex flex-row items-center gap-x-4'>
        <UserButton afterSignOutUrl='/' />
      </div>
    </div>
  );
};

export default Navbar;
