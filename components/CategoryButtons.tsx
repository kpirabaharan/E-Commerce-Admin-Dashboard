'use client';

import { buttons } from '@/lib/buttonlist';

import { Button } from '@/components/ui/button';

interface CategoryButtonsProps {
  icon: string;
  setIcon: (icon: string) => void;
}

const CategoryButtons = ({ icon, setIcon }: CategoryButtonsProps) => {
  return (
    <div className='grid grid-cols-8 pt-4 gap-y-4 place-items-center'>
      {buttons.map((btn) => (
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
    </div>
  );
};

export default CategoryButtons;
