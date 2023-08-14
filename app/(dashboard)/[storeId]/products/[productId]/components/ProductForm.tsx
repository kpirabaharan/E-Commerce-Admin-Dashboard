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

import { Product, Image, Category, Size, Color } from '@prisma/client';
import { useAlertModal } from '@/hooks/useAlertModal';

import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { Heading } from '@/components/Heading';
import MultiImageUpload from '@/components/MultiImageUpload';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

const MAX_FILE_SIZE = 10000000;

interface ProductFormProps {
  initialData: (Product & { images: Image[] }) | null;
  categories: Category[];
  sizes: Size[];
  colors: Color[];
}

const formSchema = z.object({
  name: z.string().min(1),
  images: z
    .object({
      file: z.any(),
      path: z.string().min(1),
    })
    .array()
    .refine((images) => images.length != 0, {
      message: 'Atleast one image is required',
    })
    .refine((images) => images.length <= 3, {
      message: 'Max Number of Images is 3',
    })
    .refine(
      (images) =>
        images.map((image) => image.file.size <= MAX_FILE_SIZE).includes(true),
      {
        message: 'Max image size is 10MB',
      },
    ),
  price: z.coerce.number().min(1),
  categoryId: z.string().min(1),
  colorId: z.string().min(1),
  sizeId: z.string().min(1),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
});

type ProductFormValues = z.infer<typeof formSchema>;

const ProductForm = ({
  initialData,
  categories,
  sizes,
  colors,
}: ProductFormProps) => {
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

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
          isFeatured: false,
          isArchived: false,
        },
  });

  const onSubmit = async (values: ProductFormValues) => {
    try {
      setIsLoading(true);

      /* Patch or Post Product */
      if (initialData) {
        /* Create Database Entry of Product */
        const {
          data: { uploadUrl, message },
          status: patchStatus,
        } = await axios.patch(
          `/api/${params.storeId}/products/${params.productId}`,
          values,
        );

        /* Upload Image to S3 with URL Created by AWS-SDK */
        if (patchStatus === 201) {
          const { status: putStatus } = await axios.put(
            uploadUrl,
            values.images,
          );

          if (putStatus === 200) {
            toast.success(message);
            router.refresh();
            router.push(`/${params.storeId}/products`);
          }
        } else if (patchStatus === 200) {
          toast.success(message);
          router.refresh();
          router.push(`/${params.storeId}/products`);
        } else {
          toast.error('Something Went Wrong');
        }
      } else {
        /* Create Database Entry of Product */
        const response = await axios.post(`/api/${params.storeId}/products`, {
          ...values,
          types: values.images.map((image) => image.file.type),
        });

        console.log({ response });

        /* Upload Image to S3 with URL Created by AWS-SDK */
        // if (postStatus === 201) {
        const responses = response.data.uploadUrls.map(
          async (uploadUrl: string, index: number) =>
            await axios.put(uploadUrl, values.images[index].file),
        );

        console.log({ responses });

        toast.success(response.data.message);
        router.refresh();
        router.push(`/${params.storeId}/products`);
        // }
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
          <div className='flex flex-col gap-4'>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
              {/* Label */}
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Product name'
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Price */}
              <FormField
                control={form.control}
                name='price'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='ex. 9.99'
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Category  */}
              <FormField
                control={form.control}
                name='categoryId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
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
                            placeholder='Select a category'
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Size  */}
              <FormField
                control={form.control}
                name='sizeId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Size</FormLabel>
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
                            placeholder='Select a size'
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sizes.map((size) => (
                          <SelectItem key={size.id} value={size.id}>
                            {size.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Colors  */}
              <FormField
                control={form.control}
                name='colorId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
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
                            placeholder='Select a color'
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {colors.map((color) => (
                          <SelectItem key={color.id} value={color.id}>
                            <div className='flex flex-row items-center gap-x-8 justify-between'>
                              <p className=''>{color.name}</p>
                              <div
                                className='rounded-full h-4 w-4'
                                style={{ backgroundColor: color.value }}
                              />
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Featured */}
              <FormField
                control={form.control}
                name='isFeatured'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Featured</FormLabel>
                    <div className='flex flex-row items-center gap-x-3 gap-y-0 rounded-md border p-4'>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormDescription>
                        This product will appear on the home page
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              {/* Archived */}
              <FormField
                control={form.control}
                name='isArchived'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Archived</FormLabel>
                    <div className='flex flex-row items-center gap-x-3 gap-y-0 rounded-md border p-4'>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormDescription>
                        This product will not appear anywhere in the store
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
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
                          field.value.concat(
                            files.map((file) => ({
                              file,
                              path: URL.createObjectURL(file),
                            })),
                          ),
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
