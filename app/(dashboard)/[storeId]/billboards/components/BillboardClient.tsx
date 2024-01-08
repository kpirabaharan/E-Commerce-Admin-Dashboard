'use client';

import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

import Heading from '@/components/Heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { BillboardColumn, columns } from './Columns';
import { DataTable } from '@/components/DataTable';
import { ApiList } from '@/components/ApiList';

interface BillboardClientProps {
  billboards: BillboardColumn[];
}

export const BillboardClient = ({ billboards }: BillboardClientProps) => {
  const router = useRouter();
  const params = useParams();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

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
      <DataTable filterKey='label' columns={columns} data={billboards} />
      <Heading title='APIs' description='API calls for billboards' />
      <Separator />
      <ApiList entityName='billboards' enttityIdName='billboardId' />
    </>
  );
};
