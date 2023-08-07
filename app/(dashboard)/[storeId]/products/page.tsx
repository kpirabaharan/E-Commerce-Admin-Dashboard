import { format } from 'date-fns';

import prismadb from '@/lib/prismadb';
import { currencyFormatter } from '@/lib/utils';

import { ProductClient } from './components/ProductClient';
import { ProductColumn } from './components/Columns';

interface ProductsPageProps {
  params: { storeId: string };
}

export const revalidate = 0;

const ProductsPage = async ({ params }: ProductsPageProps) => {
  const products = await prismadb.product.findMany({
    where: { storeId: params.storeId },
    include: { category: true, size: true, color: true },
    orderBy: { updatedAt: 'desc' },
  });

  const formattedProducts: ProductColumn[] = products.map((item) => ({
    id: item.id,
    name: item.name,
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
    price: currencyFormatter.format(item.price.toNumber()),
    category: item.category.name,
    size: item.category.name,
    color: item.color.value,
    updatedAt: format(item.updatedAt, 'MMMM do, yyyy'),
  }));

  return (
    <div className='flex flex-col gap-y-4'>
      <div className='flex-1  flex flex-col gap-y-4 p-8 pt-6'>
        <ProductClient products={formattedProducts} />
      </div>
    </div>
  );
};

export default ProductsPage;
