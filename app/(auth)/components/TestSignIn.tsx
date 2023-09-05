'use client';

import { MouseEvent } from 'react';
import { redirect } from 'next/navigation';
import { useSignIn } from '@clerk/nextjs';

import { Button } from '@/components/ui/button';

const TestSignIn = () => {
  const { isLoaded, signIn } = useSignIn();

  if (!isLoaded) {
    return null;
  }

  const testSignInWithEmailCode = async () => {
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
      window.location.assign('/');
      // redirect('/');
    } else {
      console.log('Login failed. Please try again later.');
    }
  };

  return (
    <Button
      variant={'default'}
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
