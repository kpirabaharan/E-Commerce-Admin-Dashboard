import prismadb from '@/lib/prismadb';

import BillboardForm from './components/BillboardForm';

interface BillboardPageProps {
  params: { billboardId: string };
}

export const revalidate = 0;

const BillboardPage = async ({ params }: BillboardPageProps) => {
  const billboard = await prismadb.billboard.findUnique({
    where: { id: params.billboardId },
  });

  return (
    <div className='flex flex-col'>
      <div className='flex-1 flex flex-col gap-y-4 p-8 pt-6'>
        <BillboardForm initialData={billboard} />
      </div>
    </div>
  );
};

export default BillboardPage;
