import { type ColumnDef } from "@tanstack/react-table";
import { type IAdminProperty } from "@/interfaces/admin/property/admin-property.interface";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Check, MoreHorizontal, Trash2, X } from "lucide-react";
import type { NavigateFunction } from "react-router-dom";

const STATUS_BADGE: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
};

export const getColumns = (
  openEditModal: (property: IAdminProperty) => void,
  navigate: NavigateFunction,
  onApprove: (id: string) => void,
  onReject: (id: string) => void,
  onDelete: (id: string) => void,
): ColumnDef<IAdminProperty>[] => {
  return [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => <div>{row.original.title.uz}</div>,
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
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <span
            className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_BADGE[status] ?? "bg-gray-100 text-gray-700"}`}
          >
            {status}
          </span>
        );
      },
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
      id: "quick-actions",
      header: "Actions",
      cell: ({ row }) => {
        const { _id, status } = row.original;
        return (
          <div className="flex items-center gap-1">
            {status !== "APPROVED" && (
              <Button
                size="sm"
                variant="outline"
                className="h-7 border-green-300 text-green-700 hover:bg-green-50 hover:text-green-800 px-2"
                onClick={() => onApprove(_id)}
              >
                <Check className="h-3.5 w-3.5 mr-1" />
                Approve
              </Button>
            )}
            {status !== "REJECTED" && (
              <Button
                size="sm"
                variant="outline"
                className="h-7 border-red-300 text-red-700 hover:bg-red-50 hover:text-red-800 px-2"
                onClick={() => onReject(_id)}
              >
                <X className="h-3.5 w-3.5 mr-1" />
                Reject
              </Button>
            )}
          </div>
        );
      },
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
              <DropdownMenuLabel>More</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigate(`/admin/properties/${property._id}`)}
              >
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => openEditModal(property)}>
                Edit Property
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => {
                  if (confirm("Bu e'lonni o'chirishni tasdiqlaysizmi?")) {
                    onDelete(property._id);
                  }
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Property
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
};
