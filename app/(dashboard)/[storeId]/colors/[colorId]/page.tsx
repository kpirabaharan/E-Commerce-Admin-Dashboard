import prismadb from '@/lib/prismadb';

import ColorForm from './components/ColorForm';

interface SizePageProps {
  params: { storeId: string; colorId: string };
}

export const revalidate = 0;

const SizePage = async ({ params }: SizePageProps) => {
  const color = await prismadb.color.findUnique({
    where: { id: params.colorId },
  });

  return (
    <div className='flex flex-col'>
      <div className='flex-1 flex flex-col gap-y-4 p-8 pt-6'>
        <ColorForm initialData={color} />
      </div>
    </div>
  );
};

export default SizePage;
