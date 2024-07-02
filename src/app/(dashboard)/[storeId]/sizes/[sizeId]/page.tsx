import prismadb from '@/lib/prismadb';

import SizeForm from './components/SizeForm';

interface SizePageProps {
  params: { storeId: string; sizeId: string };
}

export const revalidate = 0;

const SizePage = async ({ params }: SizePageProps) => {
  const size = await prismadb.size.findUnique({
    where: { id: params.sizeId },
  });

  return (
    <div className='flex flex-col'>
      <div className='flex-1 flex flex-col gap-y-4 p-8 pt-6'>
        <SizeForm initialData={size} />
      </div>
    </div>
  );
};

export default SizePage;
