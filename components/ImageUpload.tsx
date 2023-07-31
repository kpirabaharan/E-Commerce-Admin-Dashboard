'use client';

import Dropzone from 'react-dropzone';

import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import Image from 'next/image';

interface ImageUploadProps {
  image: string | null;
  setImage: (value: any) => void;
}

const ImageUpload = ({ image, setImage }: ImageUploadProps) => {
  return (
    <Dropzone
      onDrop={(acceptedFiles) =>
        setImage(URL.createObjectURL(acceptedFiles[0]))
      }
    >
      {({ getRootProps, getInputProps }) => (
        <div
          {...getRootProps()}
          className='flex flex-row items-center justify-center border-2 
          border-dashed rounded-md h-[197px] w-[350px] relative cursor-pointer'
        >
          <input {...getInputProps()} />
          <p>Add Image Here</p>
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
                setImage(null);
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
