'use client';

import { useTheme } from 'next-themes';
import { SunIcon, MoonIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';

const ThemeButton = () => {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant={'outline'}
      size={'sm'}
      onClick={
        theme === 'light' ? () => setTheme('dark') : () => setTheme('light')
      }
    >
      {theme === 'light' ? <SunIcon size={16} /> : <MoonIcon size={16} />}
    </Button>
  );
};

export default ThemeButton;
