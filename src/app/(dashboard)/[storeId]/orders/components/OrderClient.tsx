'use client';

import Heading from '@/components/Heading';

import { Separator } from '@/components/ui/separator';
import { OrderColumn, columns } from './Columns';
import { DataTable } from '@/components/DataTable';

interface OrderClientProps {
  orders: OrderColumn[];
}

export const OrderClient = ({ orders }: OrderClientProps) => {
  return (
    <>
      <Heading
        title={`Orders (${orders.length})`}
        description={'Manage orders for your store'}
      />
      <Separator />
      <DataTable filterKey='products' columns={columns} data={orders} />
    </>
  );
};
