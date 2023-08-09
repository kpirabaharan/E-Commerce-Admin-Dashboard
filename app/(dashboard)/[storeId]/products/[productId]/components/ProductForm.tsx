'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ScaleLoader } from 'react-spinners';
import { toast } from 'react-hot-toast';
import { Trash } from 'lucide-react';

import { Product, Image } from '@prisma/client';
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
import MultiImageUpload from '@/components/MultiImageUpload';

const MAX_FILE_SIZE = 10000000;
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

interface ProductFormProps {
  initialData: (Product & { images: Image[] }) | null;
}

const formSchema = z.object({
  name: z.string().min(1),
  images: z
    .object({
      file: z.any(),
      path: z.string().min(1),
    })
    .array(),
  price: z.coerce.number().min(1),
  categoryId: z.string().min(1),
  colorId: z.string().min(1),
  sizeId: z.string().min(1),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
});

type ProductFormValues = z.infer<typeof formSchema>;

const ProductForm = ({ initialData }: ProductFormProps) => {
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [image, setImage] = useState('');

  const { onOpen } = useAlertModal();

  const title = initialData ? 'Edit Product' : 'Create Product';
  const description = initialData
    ? 'Modify existing product'
    : 'Create a new product';
  const action = initialData ? 'Save Changes' : 'Create Product';

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          price: parseFloat(String(initialData?.price)),
          images: initialData.images.map((image) => ({
            path: `https://ecommerce-admin-kpirabaharan-billboards.s3.amazonaws.com/${image.url}`,
          })),
        }
      : {
          name: '',
          images: [],
          price: 0,
          categoryId: '',
          colorId: '',
          sizeId: '',
          isFeatured: false,
          isArchived: false,
        },
  });

  const onSubmit = async (values: ProductFormValues) => {
    try {
      setIsLoading(true);

      console.log(values);
      console.log(values?.images);

      /* Patch or Post Product */
      // if (initialData) {
      //   /* Create Database Entry of Product */
      //   const {
      //     data: { uploadUrl, message },
      //     status: patchStatus,
      //   } = await axios.patch(
      //     `/api/${params.storeId}/products/${params.productId}`,
      //     { ...values },
      //   );

      //   /* Upload Image to S3 with URL Created by AWS-SDK */
      //   if (patchStatus === 201) {
      //     const { status: putStatus } = await axios.put(uploadUrl, file);

      //     if (putStatus === 200) {
      //       toast.success(message);
      //       router.refresh();
      //       router.push(`/${params.storeId}/products`);
      //     }
      //   } else if (patchStatus === 200) {
      //     toast.success(message);
      //     router.refresh();
      //     router.push(`/${params.storeId}/products`);
      //   } else {
      //     toast.error('Something Went Wrong');
      //   }
      // } else {
      //   /* Create Database Entry of Product */
      //   const {
      //     data: { uploadUrl, message },
      //     status: postStatus,
      //   } = await axios.post(`/api/${params.storeId}/products`, values);

      //   /* Upload Image to S3 with URL Created by AWS-SDK */
      //   if (postStatus === 201) {
      //     const { status: putStatus } = await axios.put(uploadUrl, file);

      //     if (putStatus === 200) {
      //       toast.success(message);
      //       router.refresh();
      //       router.push(`/${params.storeId}/products`);
      //     } else {
      //       toast.error('Something Went Wrong');
      //     }
      //   }
      // }
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
                deleteType: 'product',
                deleteUrl: `/api/${params.storeId}/products/${params.productId}`,
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
          <div className='flex flex-col gap-x-4 gap-y-4'>
            {/* Label */}
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      className='w-[300px]'
                      placeholder='Product name'
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Image */}
            <FormField
              control={form.control}
              name='images'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Images</FormLabel>
                  <FormControl>
                    <MultiImageUpload
                      images={field.value}
                      onChange={(files) =>
                        field.onChange(
                          files.map((file) => ({
                            file,
                            path: URL.createObjectURL(file),
                          })),
                        )
                      }
                      onRemove={(file) =>
                        field.onChange([
                          ...field.value.filter(
                            (current) => current.file !== file,
                          ),
                        ])
                      }
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
                onClick={() => router.push(`/${params.storeId}/products`)}
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

export default ProductForm;
