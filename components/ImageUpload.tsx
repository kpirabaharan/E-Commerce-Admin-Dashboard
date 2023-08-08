'use client';

import { useState, useEffect } from 'react';
import Dropzone from 'react-dropzone';

import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import Image from 'next/image';
import { Skeleton } from './ui/skeleton';

interface ImageUploadProps {
  image: { file?: any; path: string };
  onChange: (file: any) => void;
  onRemove: () => void;
}

const ImageUpload = ({ image, onChange, onRemove }: ImageUploadProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <Dropzone onDrop={(acceptedFiles) => onChange(acceptedFiles[0])}>
      {({ getRootProps, getInputProps }) => (
        <div
          {...getRootProps()}
          className='flex flex-row items-center justify-center border-2 
          border-dashed rounded-md h-[197px] w-[350px] relative cursor-pointer'
        >
          <input {...getInputProps()} />
          {!isMounted && <Skeleton className='bg-gray-300 w-full h-full' />}
          {isMounted && !image.path && <p>Add Image Here</p>}
          {image.path && (
            <Image
              src={image.path}
              alt='Image'
              fill
              className='object-cover rounded-md'
            />
          )}
          {image.path && (
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
