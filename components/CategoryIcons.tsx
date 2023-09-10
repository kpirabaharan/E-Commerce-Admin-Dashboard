'use client';

import { useIcons } from '@/hooks/useIcons';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface CategoryIconsProps {
  icon: string;
  onChange: (icon: string) => void;
}

export const CategoryIcons = ({ icon, onChange }: CategoryIconsProps) => {
  const iconList = useIcons();

  return (
    <>
      {iconList.length === 0
        ? [...Array(22)].map((e, ind) => (
            <Skeleton className='h-10 w-10 rounded-md' key={ind} />
          ))
        : iconList.map((btn) => (
            <Button
              suppressHydrationWarning
              key={btn.value}
              type={'button'}
              size={'icon'}
              variant={icon === btn.value ? 'default' : 'outline'}
              onClick={() => onChange(btn.value)}
            >
              {<btn.icon size={24} />}
            </Button>
          ))}
    </>
  );
};
