'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { ScaleLoader } from 'react-spinners';
import { toast } from 'react-hot-toast';

import { useAlertModal } from '@/hooks/useAlertModal';

import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';

const AlertModal = () => {
  const router = useRouter();
  const params = useParams();
  const { isOpen, onClose, deleteType, deleteUrl } = useAlertModal();

  const [isLoading, setIsLoading] = useState(false);

  const onDelete = async () => {
    try {
      setIsLoading(true);

      const {
        status,
        data: { message },
      } = await axios.delete(deleteUrl!);

      if (status === 200) {
        setIsLoading(false);
        toast.success(message);
        onClose();
        router.refresh();
        if (deleteType === 'store') {
          router.push('/');
        } else if (deleteType === 'billboard') {
          router.push(`/${params.storeId}/billboards`);
        } else if (deleteType === 'category') {
          router.push(`/${params.storeId}/categories`);
        } else if (deleteType === 'size') {
          router.push(`/${params.storeId}/sizes`);
        } else if (deleteType === 'color') {
          router.push(`/${params.storeId}/colors`);
        }
      } else {
        toast.error(message);
      }
    } catch (err: any) {
      if (err.response.data) {
        toast.error(err.response.data);
      } else {
        toast.error('Internal Error');
      }
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  return (
    <Modal
      title='Are you sure?'
      description='This action cannot be undone'
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className='pt-6 gap-x-2 flex items-center justify-end w-full'>
        <Button disabled={isLoading} variant={'outline'} onClick={onClose}>
          {isLoading ? (
            <ScaleLoader color='black' height={15} />
          ) : (
            <p>Cancel</p>
          )}
        </Button>
        <Button disabled={isLoading} variant={'destructive'} onClick={onDelete}>
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
