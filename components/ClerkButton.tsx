'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SignOutButton } from '@clerk/nextjs';
import { LogOutIcon } from 'lucide-react';

import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const ClerkButton = () => {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <Skeleton className='h-8 w-8 rounded-full' />;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <SignOutButton signOutCallback={() => router.push('/')}>
            <Button variant={'outline'} size={'sm'}>
              <LogOutIcon size={16} />
            </Button>
          </SignOutButton>
        </TooltipTrigger>
        <TooltipContent>
          <p>Sign Out</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ClerkButton;
