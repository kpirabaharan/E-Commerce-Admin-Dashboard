'use client';

import { useState, useEffect } from 'react';
import Dropzone from 'react-dropzone';

import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import Image from 'next/image';
import { Skeleton } from './ui/skeleton';

interface MultiImageUploadProps {
  images: { file?: any; url: string }[];
  onChange: (files: any[]) => void;
  onRemove: (file: any) => void;
}

const MultiImageUpload = ({
  images,
  onChange,
  onRemove,
}: MultiImageUploadProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className='h-full w-full min-h-[229px] mx-auto relative'>
      <Dropzone
        onDrop={(acceptedFiles) => onChange(acceptedFiles)}
        maxFiles={3}
        accept={{
          'image/png': ['.png'],
          'image/jpeg': ['.jpeg', '.jpg'],
          'image/webp': ['.webp'],
        }}
      >
        {({ getRootProps, getInputProps }) => (
          <div
            {...getRootProps()}
            className='border-2 border-dashed rounded-md absolute cursor-pointer h-full w-full
            flex justify-center items-center'
          >
            <input {...getInputProps()} />
            {!isMounted && <Skeleton className='bg-gray-300 w-full h-full' />}
            {isMounted && images.length === 0 && <p>Add Images Here (Max 3)</p>}
          </div>
        )}
      </Dropzone>
      {images.length !== 0 && (
        <div className='flex flex-row flex-wrap h-full w-full p-4 items-center gap-4'>
          {images.map((image) => (
            <div
              key={image.url}
              className='h-[197px] w-[350px] rounded-lg relative'
            >
              <Image
                src={image.url}
                alt='Image'
                fill
                className='object-cover rounded-lg'
              />
              <Button
                className='absolute top-2 right-2'
                variant={'destructive'}
                type={'button'}
                size={'icon'}
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(image.file);
                }}
              >
                <Trash className='h-4 w-4' />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiImageUpload;
