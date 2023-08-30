'use client';

import { Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

import Heading from '@/components/Heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

import { DataTable } from '@/components/DataTable';
import { ApiList } from '@/components/ApiList';
import { CategoryColumn, columns } from './Columns';

interface CategoryClientProps {
  categories: CategoryColumn[];
}

export const CategoryClient = ({ categories }: CategoryClientProps) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className='flex flex-row items-center justify-between'>
        <Heading
          title={`Categories (${categories.length})`}
          description={'Manage categories for your store'}
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/categories/new`)}
        >
          <Plus className='mr-2' size={16} />
          <p>Create Category</p>
        </Button>
      </div>
      <Separator />
      <DataTable filterKey='name' columns={columns} data={categories} />
      <Heading title='APIs' description='API calls for categories' />
      <Separator />
      <ApiList entityName='categories' enttityIdName='categoryId' />
    </>
  );
};
