'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';

export type OrderColumn = {
  id: string;
  phone: string;
  address: string;
  isPaid: boolean;
  totalPrice: string;
  products: string;
  createdAt: string;
};

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: 'products',
    header: ({ column }) => {
      return (
        <div
          className='flex flex-row items-center cursor-pointer hover:text-black w-fit'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Products
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </div>
      );
    },
  },
  {
    accessorKey: 'phone',
    header: ({ column }) => {
      return (
        <div
          className='flex flex-row items-center cursor-pointer hover:text-black w-fit'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Phone
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </div>
      );
    },
  },
  {
    accessorKey: 'address',
    header: ({ column }) => {
      return (
        <div
          className='flex flex-row items-center cursor-pointer hover:text-black w-fit'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Address
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </div>
      );
    },
  },
  {
    accessorKey: 'totalPrice',
    header: ({ column }) => {
      return (
        <div
          className='flex flex-row items-center cursor-pointer hover:text-black w-fit'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Total Price
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </div>
      );
    },
  },
  {
    accessorKey: 'isPaid',
    header: ({ column }) => {
      return (
        <div
          className='flex flex-row items-center cursor-pointer hover:text-black w-fit'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Paid
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </div>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => {
      return (
        <div
          className='flex flex-row items-center cursor-pointer hover:text-black w-fit'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Date
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </div>
      );
    },
  },
];
