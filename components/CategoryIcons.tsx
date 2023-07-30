'use client';

import { iconList } from '@/lib/icon-list';

import { Button } from '@/components/ui/button';

interface CategoryIconsProps {
  icon: string;
  setIcon: (icon: string) => void;
}

const CategoryIcons = ({ icon, setIcon }: CategoryIconsProps) => {
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

export default CategoryIcons;
