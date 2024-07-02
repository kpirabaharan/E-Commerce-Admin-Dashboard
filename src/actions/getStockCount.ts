import prismadb from '@/lib/prismadb';

export const getStockCount = async (storeId: string) => {
  const products = await prismadb.product.findMany({
    where: { storeId, isArchived: false },
  });

  const stockCount = products.reduce(
    (total, product) => total + product.amount,
    0,
  );

  return stockCount;
};
