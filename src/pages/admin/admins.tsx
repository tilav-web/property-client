import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateAdminDialog } from "./_components/create-admin-dialog";
import { UpdateAdminDialog } from "./_components/update-admin-dialog";
import { useState } from "react";
import type { IAdmin } from "@/interfaces/admin/admin.interface";
import { adminService } from "./_services/admin.service";

export default function AdminsPage() {
  const queryClient = useQueryClient();
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isUpdateOpen, setUpdateOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<IAdmin | null>(null);

  const { data: admins, isLoading } = useQuery({
    queryKey: ["admins"],
    queryFn: adminService.getAdmins,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminService.deleteAdmin(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
  });

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this admin?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Admins</h1>
        <Button onClick={() => setCreateOpen(true)}>Create Admin</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>First Name</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {admins?.map((admin) => (
            <TableRow key={admin._id}>
              <TableCell>{admin.first_name}</TableCell>
              <TableCell>{admin.last_name}</TableCell>
              <TableCell>{admin.email}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedAdmin(admin);
                    setUpdateOpen(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="ml-2"
                  onClick={() => handleDelete(admin._id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <CreateAdminDialog
        isOpen={isCreateOpen}
        onClose={() => setCreateOpen(false)}
      />
      {selectedAdmin && (
        <UpdateAdminDialog
          isOpen={isUpdateOpen}
          onClose={() => {
            setUpdateOpen(false);
            setSelectedAdmin(null);
          }}
          admin={selectedAdmin}
        />
      )}
    </div>
  );
}
