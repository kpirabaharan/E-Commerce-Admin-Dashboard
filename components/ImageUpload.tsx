'use client';

import { useState, useEffect } from 'react';
import Dropzone from 'react-dropzone';

import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import Image from 'next/image';
import { Skeleton } from './ui/skeleton';

interface ImageUploadProps {
  setFile: (value: any) => void;
  image: string;
  setImage: (image: string) => void;
  onChange: (url: string) => void;
  onRemove: () => void;
}

const ImageUpload = ({
  setFile,
  image,
  setImage,
  onChange,
  onRemove,
}: ImageUploadProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <Dropzone
      onDrop={(acceptedFiles) => {
        setFile(acceptedFiles[0]);
        setImage(URL.createObjectURL(acceptedFiles[0]));
        onChange(acceptedFiles[0].name);
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
          {isMounted && !image && <p>Add Image Here</p>}
          {image && (
            <Image
              src={image}
              alt='Image'
              fill
              className='object-cover rounded-md'
            />
          )}
          {image && (
            <Button
              className='absolute top-2 right-2'
              variant={'destructive'}
              type={'button'}
              size={'icon'}
              onClick={(e) => {
                e.stopPropagation();
                setFile(null);
                setImage('');
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
