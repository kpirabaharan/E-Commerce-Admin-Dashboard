'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ScaleLoader } from 'react-spinners';
import { toast } from 'react-hot-toast';
import { Trash } from 'lucide-react';
import { Size } from '@prisma/client';

import { useAlertModal } from '@/hooks/useAlertModal';

import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { Heading } from '@/components/Heading';

interface SizeFormProps {
  initialData: Size | null;
}

const formSchema = z.object({
  name: z.string().min(1),
  value: z.string().min(1),
});

type SizeFormValues = z.infer<typeof formSchema>;

const SizeForm = ({ initialData }: SizeFormProps) => {
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const { onOpen } = useAlertModal();

  const title = initialData ? 'Edit Size' : 'Create Size';
  const description = initialData
    ? 'Modify existing size'
    : 'Create a new size';
  const action = initialData ? 'Save Changes' : 'Create Size';

  const form = useForm<SizeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? { name: initialData.name, value: initialData.value }
      : {
          name: '',
          value: '',
        },
  });

  const onSubmit = async (values: SizeFormValues) => {
    try {
      setIsLoading(true);

      var message: string;
      var status: number;

      /* Patch or Post Size */
      if (initialData) {
        /* Create Database Entry of Size */
        const { data, status: responseStatus } = await axios.patch(
          `/api/${params.storeId}/sizes/${params.sizeId}`,
          values,
        );
        message = data.message;
        status = responseStatus;
      } else {
        /* Create Database Entry of Size */
        const { data, status: responseStatus } = await axios.post(
          `/api/${params.storeId}/sizes`,
          values,
        );
        message = data.message;
        status = responseStatus;
      }
      if ([200, 201].includes(status)) {
        toast.success(message);
        router.refresh();
        router.push(`/${params.storeId}/sizes`);
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

  return (
    <>
      <div className='flex flex-row items-center justify-between'>
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={isLoading}
            variant={'destructive'}
            size={'icon'}
            onClick={() =>
              onOpen({
                deleteType: 'size',
                deleteUrl: `/api/${params.storeId}/sizes/${params.sizeId}`,
              })
            }
          >
            <Trash className='h-4 w-4' />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-6 w-full'
        >
          <div className='flex flex-col md:flex-row gap-x-4 gap-y-4'>
            {/* Name */}
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      className='w-[300px]'
                      placeholder='Size name'
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Value */}
            <FormField
              control={form.control}
              name='value'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input
                      className='w-[300px]'
                      placeholder='Size value'
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='flex flex-row gap-x-2'>
            {initialData && (
              <Button
                disabled={isLoading}
                variant={'outline'}
                type='button'
                onClick={() => router.push(`/${params.storeId}/sizes`)}
              >
                {isLoading ? (
                  <ScaleLoader color='black' height={15} />
                ) : (
                  <p>Cancel</p>
                )}
              </Button>
            )}
            <Button disabled={isLoading} type='submit'>
              {isLoading ? (
                <ScaleLoader color='white' height={15} />
              ) : (
                <p>{action}</p>
              )}
            </Button>
          </div>
        </form>
      </Form>
      <Separator />
    </>
  );
};

export default SizeForm;
