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

import { Store } from '@prisma/client';
import useAlertModal from '@/hooks/useAlertModal';

import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/Heading';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import CategoryIcons from '@/components/CategoryIcons';

interface SettingsFormProps {
  initialData: Store;
}

const formSchema = z.object({
  name: z.string().min(1),
});

type SettingsFormValues = z.infer<typeof formSchema>;

const SettingsForm = ({ initialData }: SettingsFormProps) => {
  const params = useParams();
  const router = useRouter();
  const [icon, setIcon] = useState(initialData.icon);

  const { onOpen } = useAlertModal();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const onUpdate = async (values: SettingsFormValues) => {
    try {
      setIsLoading(true);

      const response = await axios.patch(`/api/stores/${params.storeId}`, {
        ...values,
        icon,
      });

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
        <Heading title='Settings' description='Manage store preferences' />
        <Button
          disabled={isLoading}
          variant={'destructive'}
          size={'icon'}
          onClick={() => onOpen(params.storeId)}
        >
          <Trash className='h-4 w-4' />
        </Button>
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onUpdate)}
          className='space-y-4 w-full'
        >
          <div className='grid grid-cols-3 gap-x-4 gap-y-2'>
            <div className='col-span-2 sm:col-span-1'>
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
            </div>
            <div className='d col-span-3 sm:col-span-2 xl:col-span-1'>
              <FormLabel>Icon</FormLabel>
              <div className='grid grid-cols-8 lg:grid-cols-10 xl:grid-cols-8 pt-2 gap-y-4'>
                <CategoryIcons icon={icon} setIcon={setIcon} />
              </div>
            </div>
          </div>
          <Button disabled={isLoading} type='submit'>
            {isLoading ? (
              <ScaleLoader color='white' height={15} />
            ) : (
              <p>Save Changes</p>
            )}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default SettingsForm;
