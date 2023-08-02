'use client';

import Dropzone from 'react-dropzone';

import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import Image from 'next/image';

interface ImageUploadProps {
  file: any;
  setFile: (value: any) => void;
  onChange: (url: string) => void;
  onRemove: () => void;
}

const ImageUpload = ({
  file,
  setFile,
  onChange,
  onRemove,
}: ImageUploadProps) => {
  return (
    <Dropzone
      onDrop={(acceptedFiles) => {
        setFile(acceptedFiles[0]);
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
          {!file && <p>Add Image Here</p>}
          {file && (
            <Image
              src={URL.createObjectURL(file)}
              alt='Image'
              fill
              className='object-cover rounded-md'
            />
          )}
          {file && (
            <Button
              className='absolute top-2 right-2'
              variant={'destructive'}
              type={'button'}
              size={'icon'}
              onClick={(e) => {
                e.stopPropagation();
                setFile(null);
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