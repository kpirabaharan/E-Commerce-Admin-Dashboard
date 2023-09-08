import { format } from 'date-fns';

import prismadb from '@/lib/prismadb';
import { currencyFormatter } from '@/lib/utils';

import { OrderClient } from './components/OrderClient';
import { OrderColumn } from './components/Columns';

interface OrdersPageProps {
  params: { storeId: string };
}

export const revalidate = 0;

const OrdersPage = async ({ params }: OrdersPageProps) => {
  const orders = await prismadb.order.findMany({
    where: { storeId: params.storeId },
    include: { orderItems: { include: { product: true } } },
    orderBy: { createdAt: 'desc' },
  });

  const formattedOrders: OrderColumn[] = orders.map((item) => ({
    id: item.id,
    phone: item.phone,
    address: item.address,
    products: item.orderItems
      .map((orderItem) =>
        orderItem.amount === 1
          ? orderItem.product.name
          : `${orderItem.product.name} (${orderItem.amount})`,
      )
      .join(', '),
    totalPrice: currencyFormatter.format(
      item.orderItems.reduce(
        (total, item) => total + item.product.price.toNumber() * item.amount,
        0,
      ),
    ),
    isPaid: item.isPaid,
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }));

  return (
    <div className='flex flex-col gap-y-4'>
      <div className='flex-1  flex flex-col gap-y-4 p-8 pt-6'>
        <OrderClient orders={formattedOrders} />
      </div>
    </div>
  );
};

export default OrdersPage;
