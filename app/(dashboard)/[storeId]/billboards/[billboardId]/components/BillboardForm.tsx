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
import { Billboard } from '@prisma/client';

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
import ImageUpload from '@/components/ImageUpload';

interface BillboardFormProps {
  initialData: Billboard | null;
}

const formSchema = z.object({
  label: z.string().min(1),
  imageUrl: z.string().min(1),
});

type BillboardFormValues = z.infer<typeof formSchema>;

const BillboardForm = ({ initialData }: BillboardFormProps) => {
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const { onOpen } = useAlertModal();

  const title = initialData ? 'Edit Billboard' : 'Create Billboard';
  const description = initialData
    ? 'Modify existing billboard'
    : 'Create a new billboard';
  const toastMessage = initialData ? 'Billboard updated' : 'Billboard created';
  const action = initialData ? 'Save Changes' : 'Create Billboard';

  const form = useForm<BillboardFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || { label: '', imageUrl: '' },
  });

  const onUpdate = async (values: BillboardFormValues) => {
    try {
      setIsLoading(true);

      const response = await axios.patch(
        `/api/stores/${params.storeId}`,
        values,
      );

      if (response.status === 200) {
        setIsLoading(false);
        toast.success(response.data.message);
        router.refresh();
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
            onClick={() => onOpen(params.storeId)}
          >
            <Trash className='h-4 w-4' />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onUpdate)}
          className='space-y-6 w-full'
        >
          <div className='grid grid-cols-3 gap-x-4 gap-y-2'>
            <div className='col-span-2 sm:col-span-1'>
              <FormField
                control={form.control}
                name='label'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Label</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='BIllboard label'
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <ImageUpload />
          </div>
          <Button
            className='relative left-full -translate-x-[100%]'
            disabled={isLoading}
            type='submit'
          >
            {isLoading ? (
              <ScaleLoader color='white' height={15} />
            ) : (
              <p>{action}</p>
            )}
          </Button>
        </form>
      </Form>
      <Separator />
    </>
  );
};

export default BillboardForm;
