'use client';

import { Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

import { Heading } from '@/components/Heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { DataTable } from '@/components/DataTable';
import { ApiList } from '@/components/ApiList';
import { ProductColumn, columns } from './Columns';

interface ProductClientProps {
  products: ProductColumn[];
}

export const ProductClient = ({ products }: ProductClientProps) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className='flex flex-row items-center justify-between'>
        <Heading
          title={`Products (${products.length})`}
          description={'Manage products for your store'}
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/products/new`)}
        >
          <Plus className='mr-2' size={16} />
          <p>Create Product</p>
        </Button>
      </div>
      <Separator />
      <DataTable filterKey='label' columns={columns} data={products} />
      <Heading title='APIs' description='API calls for products' />
      <Separator />
      <ApiList entityName='products' enttityIdName='productId'/>
    </>
  );
};
