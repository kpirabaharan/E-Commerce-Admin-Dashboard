import prismadb from '@/lib/prismadb';

import ProductForm from './components/ProductForm';

interface ProductPageProps {
  params: { storeId: string; productId: string };
}

export const revalidate = 0;

const ProductPage = async ({ params }: ProductPageProps) => {
  const product = await prismadb.product.findUnique({
    where: { id: params.productId },
    include: { images: true },
  });

  const categories = await prismadb.category.findMany({
    where: { storeId: params.storeId },
  });

  const sizes = await prismadb.size.findMany({
    where: { storeId: params.storeId },
  });

  const colors = await prismadb.color.findMany({
    where: { storeId: params.storeId },
  });

  return (
    <div className='flex flex-col'>
      <div className='flex-1 flex flex-col gap-y-4 p-8 pt-6'>
        <ProductForm
          initialData={product}
          categories={categories}
          sizes={sizes}
          colors={colors}
        />
      </div>
    </div>
  );
};

export default ProductPage;
