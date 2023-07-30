'use client';

import { useState } from 'react';
import axios from 'axios';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ScaleLoader } from 'react-spinners';
import { toast } from 'react-hot-toast';

import { useStoreModal } from '@/hooks/useStoreModal';

import { Modal } from '@/components//ui/modal';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { CategoryIcons } from '@/components/CategoryIcons';

const formSchema = z.object({
  name: z.string().min(1),
});

const StoreModal = () => {
  const { isOpen, onClose } = useStoreModal();
  const [isLoading, setIsLoading] = useState(false);
  const [icon, setIcon] = useState('store');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);

      const response = await axios.post('/api/stores', { ...values, icon });

      if (response.status === 201) {
        setIsLoading(false);
        onClose();
        window.location.assign(`/${response.data.id}`);
      }
    } catch (err: any) {
      if (err.response.data) {
        toast.error(err.response.data);
      } else {
        toast.error('Something Went Wrong');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onCloseHandler = () => {
    form.reset();
    onClose();
  };

  return (
    <Modal
      title='Create Store'
      description='Add a new store to manage products and categories'
      isOpen={isOpen}
      onClose={onCloseHandler}
    >
      <div className='flex flex-col gap-y-4'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input disabled={isLoading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Icons */}
            <div className='grid grid-cols-8 pt-4 gap-y-4 place-items-center'>
              <CategoryIcons icon={icon} setIcon={setIcon} />
            </div>

            <div className='flex items-center justify-end pt-4 gap-x-2 w-full'>
              <Button
                disabled={isLoading}
                variant={'outline'}
                onClick={onCloseHandler}
                type={'button'}
              >
                {isLoading ? (
                  <ScaleLoader color='black' height={15} />
                ) : (
                  <p>Cancel</p>
                )}
              </Button>
              <Button disabled={isLoading} type='submit'>
                {isLoading ? (
                  <ScaleLoader color='white' height={15} />
                ) : (
                  <p>Confirm</p>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Modal>
  );
};

export default StoreModal;
