'use client';

import { useEffect } from 'react';

import useStoreModal from '@/hooks/useStoreModal';

const SetupPage = () => {
  const { isOpen, onOpen } = useStoreModal();

  useEffect(() => {
    if (!isOpen) {
      onOpen();
    }
  }, [isOpen, onOpen]);

  return <div className='p-4'>Root Page</div>;
};

export default SetupPage;
