'use client';

import { useEffect, useState } from 'react';

import StoreModal from '@/components/modals/StoreModal';
import AlertModal from '@/components/modals/AlertModal';

const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <AlertModal />
      <StoreModal />
    </>
  );
};

export default ModalProvider;
