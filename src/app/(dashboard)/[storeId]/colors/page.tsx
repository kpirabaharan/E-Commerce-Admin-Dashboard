import { format } from 'date-fns';

import prismadb from '@/lib/prismadb';

import { ColorClient } from './components/ColorClient';
import { ColorColumn } from './components/Columns';

interface ColorsPageProps {
  params: { storeId: string };
}

export const revalidate = 0;

const ColorsPage = async ({ params }: ColorsPageProps) => {
  const colors = await prismadb.color.findMany({
    where: { storeId: params.storeId },
    orderBy: { createdAt: 'desc' },
  });

  const formattedColors: ColorColumn[] = colors.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }));

  return (
    <div className='flex flex-col gap-y-4'>
      <div className='flex-1  flex flex-col gap-y-4 p-8 pt-6'>
        <ColorClient colors={formattedColors} />
      </div>
    </div>
  );
};

export default ColorsPage;
