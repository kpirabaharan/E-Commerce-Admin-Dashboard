'use client';

import { useState, useEffect } from 'react';
import { SignIn as SignInModal } from '@clerk/nextjs';

import { Skeleton } from '@/components/ui/skeleton';

const SignIn = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <Skeleton className='h-[455px] w-[456px] rounded-lg' />;
  }

  return <SignInModal redirectUrl={'/'} />;
};

export default SignIn;
