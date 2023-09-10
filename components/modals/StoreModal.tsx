'use client';

import { useState } from 'react';
import axios from 'axios';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ScaleLoader } from 'react-spinners';
import { toast } from 'react-hot-toast';

import { useStoreModal } from '@/hooks/useStoreModal';

import { ColorButtons } from '../ColorButtons';
import { CategoryIcons } from '@/components/CategoryIcons';

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

const formSchema = z.object({
  name: z.string().min(1),
  icon: z.string().min(1),
  color: z.string().min(1),
});

const StoreModal = () => {
  const { isOpen, onClose } = useStoreModal();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      icon: 'store',
      color: 'zinc',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);

      const response = await axios.post('/api/stores', values);

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
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='flex flex-col gap-y-2'>
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
            <FormField
              control={form.control}
              name='icon'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon</FormLabel>
                  <FormControl>
                    <div className='flex flex-row flex-wrap gap-4'>
                      <CategoryIcons
                        icon={field.value}
                        onChange={(icon) => field.onChange(icon)}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Colors */}
            <FormField
              control={form.control}
              name='color'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Store Theme</FormLabel>
                  <FormControl>
                    <div className='flex flex-row flex-wrap gap-6'>
                      <ColorButtons
                        color={field.value}
                        onChange={(color) => field.onChange(color)}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
          </div>
        </form>
      </Form>
    </Modal>
  );
};

export default StoreModal;
