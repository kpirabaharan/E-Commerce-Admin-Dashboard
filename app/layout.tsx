import { PropsWithChildren } from 'react';
import { ClerkProvider } from '@clerk/nextjs';
import { Inter } from 'next/font/google';
import './globals.css';

import ModalProvider from '@/providers/ModalProvider';
import ToastProvider from '@/providers/ToastProvider';
import ThemeProvider from '@/providers/ThemeProvider';

const font = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Admin Dashboard',
  description: 'Admin Dashboard',
};

interface RootLayoutprops extends PropsWithChildren {}

const themes = ['red', 'blue', 'light', 'dark'];

const RootLayout = ({ children }: RootLayoutprops) => {
  return (
    <ClerkProvider
      appearance={{
        layout: {
          termsPageUrl: 'https://clerk.dev/terms',
          shimmer: true,
        },
        variables: {
          colorPrimary: '#000000',
        },
      }}
    >
      <html lang='en'>
        <body className={font.className}>
          <ThemeProvider
            themes={themes}
            attribute='class'
            defaultTheme='red'
            enableSystem
          >
            <ToastProvider />
            <ModalProvider />
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
};

export default RootLayout;
