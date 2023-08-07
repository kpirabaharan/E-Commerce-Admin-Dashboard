'use client';

import { useParams, usePathname } from 'next/navigation';
import Link from 'next/link';

import { cn } from '@/lib/utils';

const NavRoutes = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) => {
  const pathname = usePathname();
  const params = useParams();

  const routes = [
    {
      label: 'Home',
      active: pathname === `/${params.storeId}`,
      href: `/${params.storeId}`,
    },
    {
      label: 'Billboards',
      active: pathname === `/${params.storeId}/billboards`,
      href: `/${params.storeId}/billboards`,
    },
    {
      label: 'Categories',
      active: pathname === `/${params.storeId}/categories`,
      href: `/${params.storeId}/categories`,
    },
    {
      label: 'Sizes',
      active: pathname === `/${params.storeId}/sizes`,
      href: `/${params.storeId}/sizes`,
    },
    {
      label: 'Colors',
      active: pathname === `/${params.storeId}/colors`,
      href: `/${params.storeId}/colors`,
    },
    {
      label: 'Products',
      active: pathname === `/${params.storeId}/products`,
      href: `/${params.storeId}/products`,
    },
    {
      label: 'Settings',
      active: pathname === `/${params.storeId}/settings`,
      href: `/${params.storeId}/settings`,
    },
  ];

  return (
    <nav
      className={cn('flex flex-row items-center gap-x-4 lg:gap-x-6', className)}
    >
      {routes.map((route) => (
        <Link
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary',
            route.active
              ? 'text-black dark:text-white'
              : 'text-muted-foreground',
          )}
          key={route.href}
          href={route.href}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  );
};

export default NavRoutes;
