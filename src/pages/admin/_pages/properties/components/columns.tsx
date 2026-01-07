import { type ColumnDef } from "@tanstack/react-table";
import { type IAdminProperty } from "@/interfaces/admin/property/admin-property.interface"; // Changed to IAdminProperty
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import type { NavigateFunction } from "react-router-dom";

export const getColumns = (
  openEditModal: (property: IAdminProperty) => void, // Changed to IAdminProperty
  navigate: NavigateFunction
): ColumnDef<IAdminProperty>[] => {
  // Changed to IAdminProperty
  return [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => <div>{row.original.title.uz}</div>, // Changed to .uz
    },
    {
      accessorKey: "author.first_name",
      header: "Author",
      cell: ({ row }) => (
        <div>
          {row.original.author?.first_name} {row.original.author?.last_name}
        </div>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
    },
    {
      accessorKey: "status",
      header: "Status",
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => (
        <div>
          {row.original.price} {row.original.currency}
        </div>
      ),
    },
    {
      id: "actions",
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
              <DropdownMenuItem
                onClick={() => navigate(`/admin/properties/${property._id}`)}
              >
                View Details
              </DropdownMenuItem>
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
