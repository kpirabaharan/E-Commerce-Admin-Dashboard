'use client';

import { useState, useEffect } from 'react';
import { UserButton } from '@clerk/nextjs';

import { Skeleton } from '@/components/ui/skeleton';

const ClerkButton = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <Skeleton className='h-8 w-8 rounded-full' />;
  }

  return <UserButton afterSignOutUrl='/' />;
};

export default ClerkButton;
