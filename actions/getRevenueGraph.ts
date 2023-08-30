import prismadb from '@/lib/prismadb';

interface GraphData {
  name: string;
  total: number;
}

export const getRevenueGraph = async (storeId: string) => {
  const paidOrders = await prismadb.order.findMany({
    where: { storeId, isPaid: true },
    include: { orderItems: { include: { product: true } } },
  });

  const graphData: GraphData[] = [
    { name: 'Jan', total: 0 },
    { name: 'Feb', total: 0 },
    { name: 'Mar', total: 0 },
    { name: 'Apr', total: 0 },
    { name: 'May', total: 0 },
    { name: 'Jun', total: 0 },
    { name: 'Jul', total: 0 },
    { name: 'Aug', total: 0 },
    { name: 'Sep', total: 0 },
    { name: 'Oct', total: 0 },
    { name: 'Nov', total: 0 },
    { name: 'Dec', total: 0 },
  ];

  paidOrders.forEach((order) => {
    const month = order.createdAt.getMonth();
    let revenueForOrder = 0;

    order.orderItems.forEach((item) => {
      revenueForOrder += item.product.price.toNumber();
    });

    graphData[month].total += revenueForOrder;
  });

  return graphData;
};
