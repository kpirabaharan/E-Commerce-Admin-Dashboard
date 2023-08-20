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

import { Billboard, Category } from '@prisma/client';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Heading } from '@/components/Heading';

interface CategoryFormProps {
  initialData: Category | null;
  billboards: Billboard[];
}

const formSchema = z.object({
  name: z.string().min(1),
  billboardId: z.string().min(1),
});

type CategoryFormValues = z.infer<typeof formSchema>;

const CategoryForm = ({ initialData, billboards }: CategoryFormProps) => {
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const { onOpen } = useAlertModal();

  const title = initialData ? 'Edit Category' : 'Create Category';
  const description = initialData
    ? 'Modify existing category'
    : 'Create a new category';
  const action = initialData ? 'Save Changes' : 'Create Category';

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? { name: initialData?.name, billboardId: initialData?.billboardId }
      : {
          name: '',
        },
  });

  const onSubmit = async (values: CategoryFormValues) => {
    try {
      setIsLoading(true);

      var message: string;
      var status: number;

      /* Patch or Post Category */
      if (initialData) {
        /* Create Database Entry of Category */
        const { data, status: responseStatus } = await axios.patch(
          `/api/${params.storeId}/categories/${params.categoryId}`,
          values,
        );
        message = data.message;
        status = responseStatus;
      } else {
        /* Create Database Entry of Category */
        const { data, status: responseStatus } = await axios.post(
          `/api/${params.storeId}/categories`,
          values,
        );
        message = data.message;
        status = responseStatus;
      }
      if ([200, 201].includes(status)) {
        toast.success(message);
        router.refresh();
        router.push(`/${params.storeId}/categories`);
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
                deleteType: 'category',
                deleteUrl: `/api/${params.storeId}/categories/${params.categoryId}`,
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
                      placeholder='Category name'
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Billboard Select */}
            <div className='w-[300px]'>
              <FormField
                control={form.control}
                name='billboardId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Billboard</FormLabel>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            defaultValue={field.value}
                            placeholder='Select a billboard'
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {billboards.map((billboard) => (
                          <SelectItem key={billboard.id} value={billboard.id}>
                            {billboard.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className='flex flex-row gap-x-2'>
            {
              <Button
                disabled={isLoading}
                variant={'outline'}
                type='button'
                onClick={() => router.push(`/${params.storeId}/categories`)}
              >
                {isLoading ? (
                  <ScaleLoader color='black' height={15} />
                ) : (
                  <p>Cancel</p>
                )}
              </Button>
            }
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

export default CategoryForm;
