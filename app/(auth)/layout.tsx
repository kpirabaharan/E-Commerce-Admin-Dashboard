import { PropsWithChildren } from 'react';

interface AuthLayoutProps extends PropsWithChildren {}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div
      className='flex items-center justify-center h-full bg-login bg-no-repeat 
      bg-cover bg-center'
    >
      {children}
    </div>
  );
};

export default AuthLayout;
