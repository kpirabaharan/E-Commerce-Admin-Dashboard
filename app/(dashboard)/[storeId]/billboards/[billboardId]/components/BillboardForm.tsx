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
import { ImageFile } from '@/types';

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

import Heading from '@/components/Heading';
import ImageUpload from '@/components/ImageUpload';

const MAX_FILE_SIZE = 10000000;

interface BillboardFormProps {
  initialData: Billboard | null;
}

const formSchema = z.object({
  label: z.string().min(1),
  image: z
    .object({
      key: z.string(),
      file: z.any(),
      url: z.string().min(1),
    })
    .refine((image) => image.url, {
      message: 'Drag and drop an image above.',
    })
    .refine(
      (image) => !image?.file?.size || image?.file?.size <= MAX_FILE_SIZE,
      {
        message: 'Max image size is 10MB.',
      },
    ),
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
  const action = initialData ? 'Save Changes' : 'Create Billboard';

  const form = useForm<BillboardFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          image: {
            key: initialData.imageKey,
            url: initialData.imageUrl,
            file: {},
          },
        }
      : {
          label: '',
          image: { key: '', file: {}, url: '' },
        },
  });

  const onSubmit = async (values: BillboardFormValues) => {
    try {
      setIsLoading(true);

      var oldImage: { key: string } | undefined;
      var deletedImage: { key: string } | undefined;
      var newImage: { type: string } | undefined;

      if (initialData) {
        oldImage =
          values.image.key === initialData.imageKey
            ? { key: initialData.imageKey }
            : undefined;
        deletedImage =
          values.image.key !== initialData.imageKey
            ? { key: initialData.imageKey }
            : undefined;
        newImage =
          values.image.key !== initialData.imageKey
            ? { type: values.image.file.type }
            : undefined;
      } else {
        newImage = { type: values.image.file.type };
      }

      /* Patch or Post Billboard */
      if (initialData) {
        /* Create Database Entry of Billboard */
        const {
          data: { uploadUrl, message },
          status: patchStatus,
        } = await axios.patch(
          `/api/${params.storeId}/billboards/${params.billboardId}`,
          {
            label: values.label,
            oldImage,
            deletedImage,
            newImage,
          },
        );

        /* Upload Image to S3 with URL Created by AWS-SDK */
        if (patchStatus === 201) {
          const { status: putStatus } = await axios.put(
            uploadUrl,
            values.image.file,
          );

          if (putStatus === 200) {
            toast.success(message);
            router.refresh();
            router.push(`/${params.storeId}/billboards`);
          }
        } else if (patchStatus === 200) {
          toast.success(message);
          router.refresh();
          router.push(`/${params.storeId}/billboards`);
        } else {
          toast.error('Failed to Upload Image to S3');
        }
      } else {
        /* Create Database Entry of Billboard */
        const {
          data: { uploadUrl, message },
          status: postStatus,
        } = await axios.post(`/api/${params.storeId}/billboards`, {
          label: values.label,
          newImage,
        });

        /* Upload Image to S3 with URL Created by AWS-SDK */
        if (postStatus === 201) {
          const { status: putStatus } = await axios.put(
            uploadUrl,
            values.image.file,
          );

          if (putStatus === 200) {
            toast.success(message);
            router.refresh();
            router.push(`/${params.storeId}/billboards`);
          } else {
            toast.error('Failed to Upload Image to S3');
          }
        }
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
                deleteType: 'billboard',
                deleteUrl: `/api/${params.storeId}/billboards/${params.billboardId}`,
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
            {/* Label */}
            <FormField
              control={form.control}
              name='label'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input
                      className='w-[300px]'
                      placeholder='Billboard label'
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
              name='image'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Background Image</FormLabel>
                  <FormControl>
                    <ImageUpload
                      image={field.value}
                      onChange={(file) =>
                        field.onChange({
                          key: file.path,
                          url: URL.createObjectURL(file),
                          file,
                        })
                      }
                      onRemove={() => field.onChange({ file: null, url: '' })}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='flex flex-row gap-x-2'>
            {
              <Button
                disabled={isLoading}
                variant={'outline'}
                type='button'
                onClick={() => router.push(`/${params.storeId}/billboards`)}
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

export default BillboardForm;
