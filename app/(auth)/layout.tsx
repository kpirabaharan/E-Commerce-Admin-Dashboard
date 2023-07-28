import { PropsWithChildren } from 'react';

interface AuthLayoutProps extends PropsWithChildren {}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className='flex items-center justify-center h-full'>{children}</div>
  );
};

export default AuthLayout;
