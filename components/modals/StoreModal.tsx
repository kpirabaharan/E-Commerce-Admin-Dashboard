'use client';

import useStoreModal from '@/hooks/useStoreModal';

import { Modal } from '@/components//ui/modal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const StoreModal = () => {
  const { isOpen, onClose } = useStoreModal();

  return (
    <Modal
      title='Create Store'
      description='Add a new store to manage products and categories'
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className='flex flex-col gap-y-4'>
        <p className='font-bold'>Name</p>
        <Input placeholder='E-Commerce' />
        <div className='flex flex-row justify-end gap-x-2'>
          <Button variant={'outline'} onClick={onClose}>
            Cancel
          </Button>
          <Button>Continue</Button>
        </div>
      </div>
    </Modal>
  );
};

export default StoreModal;
