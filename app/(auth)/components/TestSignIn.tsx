'use client';

import { useState, useEffect, MouseEvent } from 'react';
import { useSignIn } from '@clerk/nextjs';
import { ClipLoader } from 'react-spinners';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const TestSignIn = () => {
  const { isLoaded, signIn } = useSignIn();
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || !isLoaded) {
    return <Skeleton className='h-[40px] w-[345px] rounded-md' />;
  }

  const testSignInWithEmailCode = async () => {
    setIsLoading(true);
    const emailAddress = 'john+clerk_test@example.com';
    const signInResp = await signIn.create({ identifier: emailAddress });
    const { emailAddressId } = signInResp.supportedFirstFactors.find(
      (ff) =>
        ff.strategy === 'email_code' && ff.safeIdentifier === emailAddress,
    )! as any;

    await signIn.prepareFirstFactor({
      strategy: 'email_code',
      emailAddressId: emailAddressId,
    });

    const attemptResponse = await signIn.attemptFirstFactor({
      strategy: 'email_code',
      code: '424242',
    });

    if (attemptResponse?.status == 'complete') {
      setIsLoading(false);
      window.location.assign('/');
    } else {
      setIsLoading(false);
      console.log('Login failed. Please try again later.');
    }
  };

  return isLoading ? (
    <ClipLoader size={75} />
  ) : (
    <Button
      variant={'dark'}
      onClick={async (e: MouseEvent) => {
        e.preventDefault();
        await testSignInWithEmailCode();
      }}
    >
      Sign In Anonymously to Test Admin Dashboard
    </Button>
  );
};

export default TestSignIn;
