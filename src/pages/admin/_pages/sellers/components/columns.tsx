import { type ColumnDef } from "@tanstack/react-table";
import { type ISeller } from "@/interfaces/users/seller.interface";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { serverUrl } from "@/utils/shared";
import { useNavigate } from "react-router-dom";

export const getColumns = (
  openEditModal: (seller: ISeller) => void
): ColumnDef<ISeller>[] => {
  const navigate = useNavigate();

  return [
    {
      accessorKey: "user.first_name",
      header: "Name",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={`${serverUrl}/${row.original.user.avatar}`} />
            <AvatarFallback>{row.original.user.first_name?.[0]}</AvatarFallback>
          </Avatar>
          <div>
            {row.original.user.first_name} {row.original.user.last_name}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "user.email.value",
      header: "Email",
      cell: ({ row }) => <div>{row.original.user.email.value}</div>,
    },
    {
      accessorKey: "business_type",
      header: "Business Type",
    },
    {
      accessorKey: "status",
      header: "Status",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const seller = row.original;

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
                onClick={() => navigate(`/admin/sellers/${seller._id}`)}
              >
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => openEditModal(seller)}>
                Edit Seller
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
};
