import { format } from 'date-fns';

import prismadb from '@/lib/prismadb';

import { CategoryClient } from './components/CategoryClient';
import { CategoryColumn } from './components/Columns';

interface CategoriesPageProps {
  params: { storeId: string };
}

export const revalidate = 0;

const CategoriesPage = async ({ params }: CategoriesPageProps) => {
  const categories = await prismadb.category.findMany({
    where: { storeId: params.storeId },
    include: { billboard: true },
    orderBy: { createdAt: 'desc' },
  });

  const formattedCategories: CategoryColumn[] = categories.map((item) => ({
    id: item.id,
    name: item.name,
    billboardLabel: item.billboard.label,
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }));

  return (
    <div className='flex flex-col gap-y-4'>
      <div className='flex-1  flex flex-col gap-y-4 p-8 pt-6'>
        <CategoryClient categories={formattedCategories} />
      </div>
    </div>
  );
};

export default CategoriesPage;
