import { BillboardClient } from './components/client';

const BillboardsPage = () => {
  return (
    <div className='flex flex-col gap-y-4'>
      <div className='flex-1  flex flex-col gap-y-4 p-8 pt-6'>
        <BillboardClient />
      </div>
    </div>
  );
};

export default BillboardsPage;
