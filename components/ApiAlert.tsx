'use client';

import { Copy, ServerIcon } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge, BadgeProps } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';

interface ApiAlertProps {
  title: string;
  description: string;
  variant: 'public' | 'admin';
}

const textMap: Record<ApiAlertProps['variant'], string> = {
  public: 'Public',
  admin: 'Admin',
};

const variantMap: Record<ApiAlertProps['variant'], BadgeProps['variant']> = {
  public: 'secondary',
  admin: 'destructive',
};

export const ApiAlert = ({
  title,
  description,
  variant = 'public',
}: ApiAlertProps) => {
  const onCopy = () => {
    navigator.clipboard.writeText(description);
    toast.success('API route copied to clipboard');
  };

  return (
    <Alert>
      <ServerIcon className='h-4 w-4' />
      <AlertTitle className='flex flex-row items-center gap-x-2 h-4'>
        {title}
        <Badge variant={variantMap[variant]}>{textMap[variant]}</Badge>
      </AlertTitle>

      <AlertDescription className='mt-4 flex items-center justify-between'>
        <code
          className='relative rounded bg-muted px-[0.3rem] py-[0.2rem] 
          font-mono text-sm font-semibold'
        >
          {description}
        </code>
        <Button variant={'outline'} size={'icon'} onClick={onCopy}>
          <Copy size={16} />
        </Button>
      </AlertDescription>
    </Alert>
  );
};
