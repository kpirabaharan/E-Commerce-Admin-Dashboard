'use client';

import { Button } from '@/components/ui/button';
import useStoreModal from '@/hooks/useStoreModal';

const SetupPage = () => {
  const { onOpen } = useStoreModal();

  return (
    <div className='p-4'>
      <Button onClick={onOpen}>Click</Button>
    </div>
  );
};

export default SetupPage;
