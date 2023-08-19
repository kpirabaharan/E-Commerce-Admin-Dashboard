'use client';

import { useState } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import useMediaQuery from '@/hooks/useMediaQuery';

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import {
  Command,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';

import { Button } from '@/components/ui/button';

const NavRoutes = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const isLargeScreens = useMediaQuery('(max-width: 1024px)');

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
      label: 'Orders',
      active: pathname === `/${params.storeId}/orders`,
      href: `/${params.storeId}/orders`,
    },
    {
      label: 'Settings',
      active: pathname === `/${params.storeId}/settings`,
      href: `/${params.storeId}/settings`,
    },
  ];

  const currentRoute = routes.find((route) => route.active);

  return (
    <nav
      className={cn('flex flex-row items-center gap-x-4 lg:gap-x-6', className)}
    >
      {!isLargeScreens ? (
        routes.map((route) => (
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
        ))
      ) : (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              className={cn('flex gap-x-2', className)}
              variant={'link'}
              size={'sm'}
              aria-expanded={isOpen}
              aria-label='Select a Store'
              role='combobox'
            >
              <p>{currentRoute?.label}</p>
              <ChevronsUpDown size={16} className='shrink-0 opacity-50' />
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-[200px] p-0'>
            <Command>
              <CommandList>
                <CommandEmpty>No Store Found</CommandEmpty>
                <CommandGroup>
                  {routes.map((route) => (
                    <CommandItem
                      key={route.label}
                      className='text-sm'
                      onSelect={() => {
                        router.push(route.href);
                        setIsOpen(false);
                      }}
                    >
                      <p
                        className={`items-center text-center w-full ${
                          currentRoute?.label === route.label && 'font-bold'
                        }`}
                      >
                        {route.label}
                      </p>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}
    </nav>
  );
};

export default NavRoutes;
