'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';

import CellAction from './CellAction';

export type BillboardColumn = {
  id: string;
  label: string;
  updatedAt: string;
};

export const columns: ColumnDef<BillboardColumn>[] = [
  {
    accessorKey: 'label',
    header: ({ column }) => {
      return (
        <div
          className='flex flex-row items-center cursor-pointer hover:text-black w-fit'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Label
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </div>
      );
    },
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
      <div
        className='absolute top-[50%] -translate-y-[50%] left-[50%] 
        -translate-x-[50%]'
      >
        <CellAction data={row.original} />
      </div>
    ),
  },
];
