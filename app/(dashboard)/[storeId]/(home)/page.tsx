import { DollarSignIcon, CreditCardIcon, PackageIcon } from 'lucide-react';

import { currencyFormatter } from '@/lib/utils';
import { getTotalRevenue } from '@/actions/getTotalRevenue';
import { getSalesCount } from '@/actions/getSalesCount';
import { getStockCount } from '@/actions/getStockCount';

import Heading from '@/components/Heading';
import Overview from '@/components/Overview';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getRevenueGraph } from '@/actions/getRevenueGraph';

interface DashboardPageProps {
  params: { storeId: string };
}

const DashboardPage = async ({ params }: DashboardPageProps) => {
  const totalRevenue = await getTotalRevenue(params.storeId);
  const salesCount = await getSalesCount(params.storeId);
  const stockCount = await getStockCount(params.storeId);

  const graphRevenue = await getRevenueGraph(params.storeId);

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <Heading title='Dashboard' description='Overview of your store' />
        <Separator />
        <div className='grid gap-4 grid-cols-1 sm:grid-cols-3'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Total Revenue
              </CardTitle>
              <DollarSignIcon className='text-muted-foreground' size={16} />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {currencyFormatter.format(totalRevenue)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Sales</CardTitle>
              <CreditCardIcon className='text-muted-foreground' size={16} />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>+{salesCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Stock</CardTitle>
              <PackageIcon className='text-muted-foreground' size={16} />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{stockCount}</div>
            </CardContent>
          </Card>
        </div>
        <Card className='col-span-3'>
          <CardHeader>
            <CardTitle>Annual Revenue</CardTitle>
            <CardContent className='p-0 pt-4'>
              <Overview data={graphRevenue} />
            </CardContent>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
