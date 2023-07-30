'use client';

import { Heading } from '@/components/ui/Heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Plus } from 'lucide-react';

export const BillboardClient = () => {
  return (
    <>
      <div className='flex flex-row items-center justify-between'>
        <Heading
          title={'Billboards (0)'}
          description={'Manage billboards for your store'}
        />
        <Button>
          <Plus className='mr-2' size={16} />
          Create Billboard
        </Button>
      </div>
      <Separator />
    </>
  );
};
