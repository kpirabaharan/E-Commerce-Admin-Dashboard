'use client';

import { useEffect, useState } from 'react';
import { Modal } from '../ui/modal';
import { Button } from '../ui/button';
import { ScaleLoader } from 'react-spinners';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

const AlertModal = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: AlertModalProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Modal
      title='Are you sure?'
      description='This action cannot be undone.'
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className='pt-6 space-x-2 flex items-center justify-end w-full'>
        <Button disabled={isLoading} variant={'outline'} onClick={onClose}>
          {isLoading ? (
            <ScaleLoader color='black' height={15} />
          ) : (
            <p>Cancel</p>
          )}
        </Button>
        <Button
          disabled={isLoading}
          variant={'destructive'}
          onClick={onConfirm}
        >
          {isLoading ? (
            <ScaleLoader color='white' height={15} />
          ) : (
            <p>Continue</p>
          )}
        </Button>
      </div>
    </Modal>
  );
};

export default AlertModal;
