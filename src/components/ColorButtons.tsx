'use client';

import { CheckIcon } from 'lucide-react';

import { useColors } from '@/hooks/useColors';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface ColorButtonsProps {
  color: string;
  onChange: (icon: string) => void;
}

export const ColorButtons = ({ color, onChange }: ColorButtonsProps) => {
  const colorList = useColors();

  return (
    <>
      {colorList.length === 0
        ? [...Array(6)].map((e, ind) => (
            <Skeleton className='h-10 w-10 rounded-md' key={ind} />
          ))
        : colorList.map((btn) => (
            <Button
              suppressHydrationWarning
              key={btn.name}
              type='button'
              size={'rounded'}
              style={{
                backgroundColor: btn.value,
                scale: color === btn.name ? 1.25 : 1,
              }}
              onClick={() => onChange(btn.name)}
            >
              {color === btn.name && <CheckIcon size={20} />}
            </Button>
          ))}
    </>
  );
};
