'use client';

import { Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

import { Heading } from '@/components/Heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { BillboardColumn, columns } from './Columns';
import { DataTable } from '@/components/DataTable';

interface BillboardClientProps {
  billboards: BillboardColumn[];
}

export const BillboardClient = ({ billboards }: BillboardClientProps) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className='flex flex-row items-center justify-between'>
        <Heading
          title={`Billboards (${billboards.length})`}
          description={'Manage billboards for your store'}
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/billboards/new`)}
        >
          <Plus className='mr-2' size={16} />
          <p>Create Billboard</p>
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={billboards} searchKey='label' />
    </>
  );
};
