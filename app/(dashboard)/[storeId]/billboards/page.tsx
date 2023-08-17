import { format } from 'date-fns';

import prismadb from '@/lib/prismadb';

import { BillboardClient } from './components/BillboardClient';
import { BillboardColumn } from './components/Columns';

interface BillboardsPageProps {
  params: { storeId: string };
}

export const revalidate = 0;

const BillboardsPage = async ({ params }: BillboardsPageProps) => {
  const billboards = await prismadb.billboard.findMany({
    where: { storeId: params.storeId },
    orderBy: { createdAt: 'desc' },
  });

  const formattedBillboards: BillboardColumn[] = billboards.map((item) => ({
    id: item.id,
    label: item.label,
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }));

  return (
    <div className='flex flex-col gap-y-4'>
      <div className='flex-1  flex flex-col gap-y-4 p-8 pt-6'>
        <BillboardClient billboards={formattedBillboards} />
      </div>
    </div>
  );
};

export default BillboardsPage;
