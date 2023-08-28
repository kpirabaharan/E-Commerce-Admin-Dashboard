import { DollarSignIcon, CreditCardIcon, PackageIcon } from 'lucide-react';

import prismadb from '@/lib/prismadb';
import { currencyFormatter } from '@/lib/utils';

import { Heading } from '@/components/Heading';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DashboardPageProps {
  params: { storeId: string };
}

const DashboardPage = ({ params }: DashboardPageProps) => {
  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <Heading title='Dashboard' description='Overview of your store' />
        <Separator />
        <div className='grid gap-4 grid-cols-3'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Total Revenue
              </CardTitle>
              <DollarSignIcon className='text-muted-foreground' size={16} />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {currencyFormatter.format(100)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Sales</CardTitle>
              <CreditCardIcon className='text-muted-foreground' size={16} />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>+25</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Stock</CardTitle>
              <PackageIcon className='text-muted-foreground' size={16} />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>5</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
