import SignIn from '@/app/(auth)/components/SignIn';
import TestSignIn from '@/app/(auth)/components/TestSignIn';

const SignInPage = () => {
  return (
    <div className='flex flex-col gap-y-8 items-center justify-center'>
      <SignIn />
      <TestSignIn />
    </div>
  );
};

export default SignInPage;
