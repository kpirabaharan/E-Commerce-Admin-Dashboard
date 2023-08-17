'use client';

import { Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

import { Heading } from '@/components/Heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

import { DataTable } from '@/components/DataTable';
import { ApiList } from '@/components/ApiList';
import { ColorColumn, columns } from './Columns';

interface ColorClientProps {
  colors: ColorColumn[];
}

export const ColorClient = ({ colors }: ColorClientProps) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className='flex flex-row items-center justify-between'>
        <Heading
          title={`Colors (${colors.length})`}
          description={'Manage colors for your store'}
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/colors/new`)}
        >
          <Plus className='mr-2' size={16} />
          <p>Create Color</p>
        </Button>
      </div>
      <Separator />
      <DataTable filterKey='name' columns={columns} data={colors}  />
      <Heading title='APIs' description='API calls for colors' />
      <Separator />
      <ApiList entityName='colors' enttityIdName='colorId' />
    </>
  );
};
