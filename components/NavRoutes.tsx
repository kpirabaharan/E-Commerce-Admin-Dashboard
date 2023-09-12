'use client';

import { useState } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';

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

  const routes = [
    {
      label: 'Home',
      active: pathname === `/${params.storeId}`,
      href: `/${params.storeId}`,
    },
    // {
    //   label: 'Sales',
    //   active: pathname === `/${params.storeId}/sales`,
    //   href: `/${params.storeId}/sales`,
    // },
    {
      label: 'Billboards',
      active: pathname.includes(`/${params.storeId}/billboards`),
      href: `/${params.storeId}/billboards`,
    },
    {
      label: 'Categories',
      active: pathname.includes(`/${params.storeId}/categories`),
      href: `/${params.storeId}/categories`,
    },
    {
      label: 'Sizes',
      active: pathname.includes(`/${params.storeId}/sizes`),
      href: `/${params.storeId}/sizes`,
    },
    {
      label: 'Colors',
      active: pathname.includes(`/${params.storeId}/colors`),
      href: `/${params.storeId}/colors`,
    },
    {
      label: 'Products',
      active: pathname.includes(`/${params.storeId}/products`),
      href: `/${params.storeId}/products`,
    },
    {
      label: 'Orders',
      active: pathname.includes(`/${params.storeId}/orders`),
      href: `/${params.storeId}/orders`,
    },
    {
      label: 'Settings',
      active: pathname.includes(`/${params.storeId}/settings`),
      href: `/${params.storeId}/settings`,
    },
  ];

  const currentRoute = routes.find((route) => route.active);

  return (
    <nav
      className={cn(
        `absolute left-[50%] -translate-x-[50%] lg:left-0 lg:translate-x-0 lg:relative`,
        className,
      )}
    >
      <div className='hidden lg:flex flex-row items-center lg:ml-2 gap-x-6'>
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
      </div>
      <div className='flex lg:hidden'>
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
      </div>
    </nav>
  );
};

export default NavRoutes;
