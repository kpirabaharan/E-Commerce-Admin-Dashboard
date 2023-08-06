'use client';

import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Copy, Edit, MoreHorizontal, Trash } from 'lucide-react';

import { useAlertModal } from '@/hooks/useAlertModal';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

import { CategoryColumn } from './Columns';

interface CellActionProps {
  data: CategoryColumn;
}

const CellAction = ({ data }: CellActionProps) => {
  const router = useRouter();
  const params = useParams();
  const { onOpen } = useAlertModal();

  const onCopy = () => {
    navigator.clipboard.writeText(data.id);
    toast.success('Category Id copied to clipboard', { id: 'Category Id' });
  };

  const onDelete = () => {
    onOpen({
      deleteType: 'category',
      deleteUrl: `/api/${params.storeId}/categories/${data.id}`,
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={'ghost'} className='h-8 w-8 p-0'>
          <span className='sr-only'>Open Menu</span>
          <MoreHorizontal size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={onCopy}>
          <Copy className='mr-2' size={16} />
          <p>Copy Id</p>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            router.push(`/${params.storeId}/categories/${data.id}`)
          }
        >
          <Edit className='mr-2' size={16} />
          <p>Update</p>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onDelete}>
          <Trash className='mr-2 text-destructive' size={16} />
          <p className='text-destructive'>Delete</p>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CellAction;
