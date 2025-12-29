import { useQuery, useQueryClient } from "@tanstack/react-query";
import { adminPropertyService } from "../../../_services/admin-property.service";
import Loading from "@/components/common/loadings/loading";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EditPropertyForm } from "../../../_pages/properties/components/edit-property-form";
import { Button } from "@/components/ui/button";
import { type IAdminProperty } from "@/interfaces/admin/property/admin-property.interface";

export default function SellerProperties({ sellerId }: { sellerId: string }) {
  const queryClient = useQueryClient();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] =
    useState<IAdminProperty | null>(null);

  const {
    data: properties,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["admin-seller-properties", sellerId],
    queryFn: () => adminPropertyService.findBySeller(sellerId),
    enabled: !!sellerId,
  });

  const openEditModal = (property: IAdminProperty) => {
    setSelectedProperty(property);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedProperty(null);
    queryClient.invalidateQueries({
      queryKey: ["admin-seller-properties", sellerId],
    });
  };

  if (isLoading) {
    return <Loading />;
  }

  if (isError || !properties) {
    return <div>Error loading properties.</div>;
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {properties.map((property) => (
            <TableRow key={property._id}>
              <TableCell>{property.title.en}</TableCell>
              <TableCell>{property.category}</TableCell>
              <TableCell>
                <Badge>{property.status}</Badge>
              </TableCell>
              <TableCell>
                {property.price} {property.currency}
              </TableCell>
              <TableCell>
                <Link to={`/admin/properties/${property._id}`}>
                  View Details
                </Link>
                <Button
                  variant="ghost"
                  onClick={() => openEditModal(property)}
                  className="ml-2"
                >
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Property</DialogTitle>
          </DialogHeader>
          {selectedProperty && (
            <EditPropertyForm
              property={selectedProperty}
              onSuccess={closeEditModal}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
