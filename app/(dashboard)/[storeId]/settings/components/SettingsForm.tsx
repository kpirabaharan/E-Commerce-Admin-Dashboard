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
import { useAlertModal } from '@/hooks/useAlertModal';
import { useOrigin } from '@/hooks/useOrigin';

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

import { CategoryIcons } from '@/components/CategoryIcons';
import Heading from '@/components/Heading';
import { ApiAlert } from '@/components/ApiAlert';
import { ColorButtons } from '@/components/ColorButtons';

interface SettingsFormProps {
  initialData: Store;
}

const formSchema = z.object({
  name: z.string().min(1),
  limit: z.coerce
    .number()
    .int({ message: 'Please enter a valid whole number.' })
    .gte(1)
    .lte(1000000),
  icon: z.string().min(1),
  color: z.string().min(1),
});

type SettingsFormValues = z.infer<typeof formSchema>;

const SettingsForm = ({ initialData }: SettingsFormProps) => {
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const origin = useOrigin();
  const { onOpen } = useAlertModal();

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const onUpdate = async (values: SettingsFormValues) => {
    try {
      setIsLoading(true);

      const response = await axios.patch(
        `/api/stores/${params.storeId}`,
        values,
      );

      if (response.status === 200) {
        setIsLoading(false);
        toast.success(response.data.message, { id: 'Settings Update' });
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
          onClick={() =>
            onOpen({
              deleteType: 'store',
              deleteUrl: `/api/stores/${params.storeId}`,
            })
          }
        >
          <Trash className='h-4 w-4' />
        </Button>
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onUpdate)}
          className='space-y-6 w-full'
        >
          <div className='grid grid-cols-2 gap-x-4 gap-y-4'>
            {/* Name */}
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

            {/* Limit */}
            <div className='col-span-2 sm:col-span-1'>
              <FormField
                control={form.control}
                name='limit'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Limit Per Item</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='ex. 5'
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Icons */}
            <div className='col-span-2'>
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
            </div>

            {/* Colors */}
            <div className='col-span-2'>
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
      <Separator />
      <ApiAlert
        title='NEXT_PUBLIC_API_URL'
        description={`${origin}/api/${params.storeId}`}
        variant={'public'}
      />
    </>
  );
};

export default SettingsForm;
