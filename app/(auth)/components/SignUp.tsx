'use client';

import { useState, useEffect } from 'react';
import { SignUp as SignUpModal } from '@clerk/nextjs';

import { Skeleton } from '@/components/ui/skeleton';

const SignUp = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <Skeleton className='h-[530px] w-[456px] rounded-lg' />;
  }

  return <SignUpModal redirectUrl={'/'} />;
};

export default SignUp;
