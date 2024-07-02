'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Dropzone from 'react-dropzone';
import { Trash } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface ImageUploadProps {
  image: { file?: any; url: string };
  onChange: (file: any) => void;
  onRemove: () => void;
}

const ImageUpload = ({ image, onChange, onRemove }: ImageUploadProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <Dropzone
      onDrop={(acceptedFiles) => onChange(acceptedFiles[0])}
      accept={{
        'image/png': ['.png'],
        'image/jpeg': ['.jpeg', '.jpg'],
        'image/webp': ['.webp'],
      }}
    >
      {({ getRootProps, getInputProps }) => (
        <div
          {...getRootProps()}
          className='flex flex-row items-center justify-center border-2 
          border-dashed rounded-md h-[197px] w-[350px] relative cursor-pointer'
        >
          <input {...getInputProps()} />
          {!isMounted && <Skeleton className='bg-gray-300 w-full h-full' />}
          {isMounted && !image.url && <p>Add Image Here</p>}
          {image.url && (
            <Image
              src={image.url}
              alt='Image'
              fill
              className='object-cover rounded-md'
            />
          )}
          {image.url && (
            <Button
              className='absolute top-2 right-2'
              variant={'destructive'}
              type={'button'}
              size={'icon'}
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
            >
              <Trash className='h-4 w-4' />
            </Button>
          )}
        </div>
      )}
    </Dropzone>
  );
};

export default ImageUpload;
