'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';

import CellAction from './CellAction';

export type ColorColumn = {
  id: string;
  name: string;
  value: string;
  updatedAt: string;
};

export const columns: ColumnDef<ColorColumn>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <div
          className='flex flex-row items-center cursor-pointer hover:text-black w-fit'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Name
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </div>
      );
    },
  },
  {
    accessorKey: 'value',
    header: ({ column }) => {
      return (
        <div
          className='flex flex-row items-center cursor-pointer hover:text-black w-fit'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Value
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </div>
      );
    },
    cell: ({ row }) => (
      <div className='flex items-center gap-x-2'>
        <p className='w-[65px]'>{row.original.value}</p>
        <div
          className='h-6 w-6 rounded-full border'
          style={{ backgroundColor: row.original.value }}
        />
      </div>
    ),
  },
  {
    accessorKey: 'updatedAt',
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
  {
    id: 'actions',
    cell: ({ row }) => (
      <div className='absolute top-[50%] -translate-y-[50%] left-[50%] -translate-x-[50%]'>
        <CellAction data={row.original} />
      </div>
    ),
  },
];
