import prismadb from '@/lib/prismadb';

interface GraphData {
  name: string;
  Total: number;
}

export const getRevenueGraph = async (storeId: string) => {
  const paidOrders = await prismadb.order.findMany({
    where: { storeId, isPaid: true },
    include: { orderItems: { include: { product: true } } },
  });

  const graphData: GraphData[] = [
    { name: 'Jan', Total: 0 },
    { name: 'Feb', Total: 0 },
    { name: 'Mar', Total: 0 },
    { name: 'Apr', Total: 0 },
    { name: 'May', Total: 0 },
    { name: 'Jun', Total: 0 },
    { name: 'Jul', Total: 0 },
    { name: 'Aug', Total: 0 },
    { name: 'Sep', Total: 0 },
    { name: 'Oct', Total: 0 },
    { name: 'Nov', Total: 0 },
    { name: 'Dec', Total: 0 },
  ];

  paidOrders.forEach((order) => {
    const month = order.createdAt.getMonth();
    let revenueForOrder = 0;

    order.orderItems.forEach((item) => {
      revenueForOrder += item.product.price.toNumber();
    });

    graphData[month].Total += revenueForOrder;
  });

  return graphData;
};
