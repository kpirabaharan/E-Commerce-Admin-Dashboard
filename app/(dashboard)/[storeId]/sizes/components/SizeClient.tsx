'use client';

import { Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

import { Heading } from '@/components/Heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

import { DataTable } from '@/components/DataTable';
import { ApiList } from '@/components/ApiList';
import { SizeColumn, columns } from './Columns';

interface SizeClientProps {
  sizes: SizeColumn[];
}

export const SizeClient = ({ sizes }: SizeClientProps) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className='flex flex-row items-center justify-between'>
        <Heading
          title={`Sizes (${sizes.length})`}
          description={'Manage sizes for your store'}
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/sizes/new`)}
        >
          <Plus className='mr-2' size={16} />
          <p>Create Size</p>
        </Button>
      </div>
      <Separator />
      <DataTable filterKey='name' columns={columns} data={sizes}  />
      <Heading title='APIs' description='API calls for sizes' />
      <Separator />
      <ApiList entityName='sizes' enttityIdName='sizeId' />
    </>
  );
};
