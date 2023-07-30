'use client';

import { useIcons } from '@/hooks/useIcons';

import { Button } from '@/components/ui/button';

interface CategoryIconsProps {
  icon: string;
  setIcon: (icon: string) => void;
}

export const CategoryIcons = ({ icon, setIcon }: CategoryIconsProps) => {
  const iconList = useIcons();

  return (
    <>
      {iconList.map((btn) => (
        <Button
          suppressHydrationWarning
          key={btn.value}
          type={'button'}
          size={'icon'}
          variant={icon === `${btn.value}` ? 'default' : 'outline'}
          onClick={() => setIcon(btn.value)}
        >
          {<btn.icon size={24} />}
        </Button>
      ))}
    </>
  );
};
