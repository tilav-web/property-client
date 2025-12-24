import { type ColumnDef } from '@tanstack/react-table';
import { type IProperty } from '@/interfaces/property/property.interface';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';

export const getColumns = (
  openEditModal: (property: IProperty) => void,
): ColumnDef<IProperty>[] => {
  return [
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => <div>{(row.original.title as any).en}</div>,
    },
    {
      accessorKey: 'author.first_name',
      header: 'Author',
      cell: ({ row }) => (
        <div>
          {row.original.author?.first_name} {row.original.author?.last_name}
        </div>
      ),
    },
    {
      accessorKey: 'category',
      header: 'Category',
    },
    {
      accessorKey: 'status',
      header: 'Status',
    },
    {
      accessorKey: 'price',
      header: 'Price',
      cell: ({ row }) => (
        <div>
          {row.original.price} {row.original.currency}
        </div>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const property = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => openEditModal(property)}>
                Edit Property
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
};
