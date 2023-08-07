import prismadb from '@/lib/prismadb';

import ProductForm from './components/ProductForm';

interface ProductPageProps {
  params: { productId: string };
}

export const revalidate = 0;

const ProductPage = async ({ params }: ProductPageProps) => {
  const product = await prismadb.product.findUnique({
    where: { id: params.productId },
    include: { images: true },
  });

  return (
    <div className='flex flex-col'>
      <div className='flex-1 flex flex-col gap-y-4 p-8 pt-6'>
        <ProductForm initialData={product} />
      </div>
    </div>
  );
};

export default ProductPage;
