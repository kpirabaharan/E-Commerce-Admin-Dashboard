'use client';

import { ColumnDef } from '@tanstack/react-table';
import CellAction from './CellAction';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type BillboardColumn = {
  id: string;
  label: string;
  createdAt: string;
};

export const columns: ColumnDef<BillboardColumn>[] = [
  {
    accessorKey: 'label',
    header: 'Label',
  },
  {
    accessorKey: 'createdAt',
    header: 'Date',
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
