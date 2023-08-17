import { format } from 'date-fns';

import prismadb from '@/lib/prismadb';

import { SizeClient } from './components/SizeClient';
import { SizeColumn } from './components/Columns';

interface SizesPageProps {
  params: { storeId: string };
}

export const revalidate = 0;

const SizesPage = async ({ params }: SizesPageProps) => {
  const sizes = await prismadb.size.findMany({
    where: { storeId: params.storeId },
    orderBy: { createdAt: 'desc' },
  });

  const formattedSizes: SizeColumn[] = sizes.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }));

  return (
    <div className='flex flex-col gap-y-4'>
      <div className='flex-1  flex flex-col gap-y-4 p-8 pt-6'>
        <SizeClient sizes={formattedSizes} />
      </div>
    </div>
  );
};

export default SizesPage;
