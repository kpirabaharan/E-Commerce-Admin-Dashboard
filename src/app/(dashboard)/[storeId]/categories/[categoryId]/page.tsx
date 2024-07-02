import prismadb from '@/lib/prismadb';

import CategoryForm from './components/CategoryForm';

interface CategoryPageProps {
  params: { categoryId: string; storeId: string };
}

export const revalidate = 0;

const CategoryPage = async ({ params }: CategoryPageProps) => {
  const category = await prismadb.category.findUnique({
    where: { id: params.categoryId },
  });

  const billboards = await prismadb.billboard.findMany({
    where: { storeId: params.storeId },
  });

  return (
    <div className='flex flex-col'>
      <div className='flex-1 flex flex-col gap-y-4 p-8 pt-6'>
        <CategoryForm initialData={category} billboards={billboards} />
      </div>
    </div>
  );
};

export default CategoryPage;
