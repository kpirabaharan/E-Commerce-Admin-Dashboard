'use client';

import { ComponentPropsWithoutRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PlusCircle, Check, ChevronsUpDown } from 'lucide-react';

import { Store } from '@prisma/client';
import { cn } from '@/lib/utils';
import { useIcons } from '@/hooks/useIcons';
import { useStoreModal } from '@/hooks/useStoreModal';

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import {
  Command,
  CommandList,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from '@/components/ui/command';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

type PopoverTriggerProps = ComponentPropsWithoutRef<typeof PopoverTrigger>;

interface StoreSwitcherProps extends PopoverTriggerProps {
  items: Store[];
}

const StoreSwitcher = ({ className, items = [] }: StoreSwitcherProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { onOpen } = useStoreModal();
  const params = useParams();
  const router = useRouter();

  const iconList = useIcons();

  const formattedItems = items.map((item) => ({
    value: item.id,
    label: item.name,
    icon: iconList.find((btn) => btn.value === item.icon)?.icon,
  }));

  const currentStore = formattedItems.find(
    (item) => item.value === params.storeId,
  );

  const onStoreSelect = (store: { value: string; label: string }) => {
    setIsOpen(false);
    router.push(`/${store.value}`);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          className={cn(
            'min-w-[75px] sm:min-w-[200px] gap-x-4 justify-between',
            className,
          )}
          variant={'outline'}
          size={'sm'}
          aria-expanded={isOpen}
          aria-label='Select a Store'
          role='combobox'
        >
          {currentStore?.icon ? (
            <currentStore.icon size={16} />
          ) : (
            <Skeleton className='h-4 w-4 rounded-md' />
          )}
          <p className='hidden sm:flex'>{currentStore?.label}</p>
          <ChevronsUpDown className='ml-auto h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[200px] p-0'>
        <Command>
          <CommandList>
            <CommandInput placeholder='Search store...' />
            <CommandEmpty>No Store Found</CommandEmpty>
            <CommandGroup heading='Stores'>
              {formattedItems.map((store) => (
                <CommandItem
                  key={store.value}
                  className='text-sm gap-x-2'
                  onSelect={() => {
                    onStoreSelect(store);
                    setIsOpen(false);
                  }}
                >
                  {store.icon ? (
                    <store.icon className='mx-1' size={16} />
                  ) : (
                    <Skeleton className='h-4 w-4 rounded-md' />
                  )}
                  <p
                    className={`${
                      currentStore?.value === store.value
                        ? 'font-bold'
                        : 'font-normal'
                    }`}
                  >
                    {store.label}
                  </p>
                  <Check
                    className={cn(
                      'ml-auto h-4 w-4',
                      currentStore?.value === store.value
                        ? 'opacity-100'
                        : 'opacity-0',
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem
                className='gap-x-2'
                onSelect={() => {
                  setIsOpen(false);
                  onOpen();
                }}
              >
                <PlusCircle className='h-5 w-5' />
                <p>Create a New Store</p>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default StoreSwitcher;
