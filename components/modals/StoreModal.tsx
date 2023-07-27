'use client';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import useStoreModal from '@/hooks/useStoreModal';

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
  name: z
    .string()
    .min(1, { message: 'Name of atleast one character required' }),
});

const StoreModal = () => {
  const { isOpen, onClose } = useStoreModal();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    // TODO: Create Store
  };

  return (
    <Modal
      title='Create Store'
      description='Add a new store to manage products and categories'
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className='flex flex-col gap-y-4'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Store Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex items-center justify-end pt-4 gap-x-2 w-full'>
              <Button variant={'outline'} onClick={onClose}>
                Cancel
              </Button>
              <Button type='submit'>Confirm</Button>
            </div>
          </form>
        </Form>
      </div>
    </Modal>
  );
};

export default StoreModal;
