import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { adminPropertyService } from "../../_services/admin-property.service";
import Loading from "@/components/common/loadings/loading";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { IAdminApartmentRent } from "@/interfaces/admin/property/admin-apartment-rent.interface";
import type { IAdminApartmentSale } from "@/interfaces/admin/property/admin-apartment-sale.interface";
import { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { X } from "lucide-react";

export default function PropertyDetailsPage() {
  const { propertyId } = useParams<{ propertyId: string }>();
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  const {
    data: property,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["admin-property", propertyId],
    queryFn: () => adminPropertyService.findOne(propertyId!),
    enabled: !!propertyId,
  });

  if (isLoading) {
    return <Loading />;
  }

  if (isError || !property) {
    return <div>Error loading property details.</div>;
  }

  const isApartmentRent = property.category === "APARTMENT_RENT";

  const apartmentDetails = property as IAdminApartmentRent | IAdminApartmentSale;

  return (
    <div className="p-4 space-y-4 max-h-screen overflow-y-auto">
      <Card>
        <CardHeader>
          <CardTitle>{property.title.en}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Category</p>
              <p>{property.category}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge>{property.status}</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Price</p>
              <p>
                {property.price} {property.currency}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Author</p>
              <p>
                {property.author?.first_name} {property.author?.last_name}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Premium</p>
              <p>{property.is_premium ? "Yes" : "No"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Archived</p>
              <p>{property.is_archived ? "Yes" : "No"}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {apartmentDetails.bedrooms !== undefined && (
              <div>
                <p className="text-sm text-muted-foreground">Bedrooms</p>
                <p>{apartmentDetails.bedrooms}</p>
              </div>
            )}
            {apartmentDetails.bathrooms !== undefined && (
              <div>
                <p className="text-sm text-muted-foreground">Bathrooms</p>
                <p>{apartmentDetails.bathrooms}</p>
              </div>
            )}
            {apartmentDetails.floor_level !== undefined && (
              <div>
                <p className="text-sm text-muted-foreground">Floor Level</p>
                <p>{apartmentDetails.floor_level}</p>
              </div>
            )}
            {apartmentDetails.total_floors !== undefined && (
              <div>
                <p className="text-sm text-muted-foreground">Total Floors</p>
                <p>{apartmentDetails.total_floors}</p>
              </div>
            )}
            {apartmentDetails.area !== undefined && (
              <div>
                <p className="text-sm text-muted-foreground">Area (m²)</p>
                <p>{apartmentDetails.area}</p>
              </div>
            )}
            {apartmentDetails.balcony !== undefined && (
              <div>
                <p className="text-sm text-muted-foreground">Balcony</p>
                <p>{apartmentDetails.balcony ? "Yes" : "No"}</p>
              </div>
            )}
            {apartmentDetails.furnished !== undefined && (
              <div>
                <p className="text-sm text-muted-foreground">Furnished</p>
                <p>{apartmentDetails.furnished ? "Yes" : "No"}</p>
              </div>
            )}
            {apartmentDetails.repair_type && (
              <div>
                <p className="text-sm text-muted-foreground">Repair Type</p>
                <p>{apartmentDetails.repair_type}</p>
              </div>
            )}
            {apartmentDetails.heating && (
              <div>
                <p className="text-sm text-muted-foreground">Heating</p>
                <p>{apartmentDetails.heating}</p>
              </div>
            )}
            {apartmentDetails.air_conditioning !== undefined && (
              <div>
                <p className="text-sm text-muted-foreground">
                  Air Conditioning
                </p>
                <p>{apartmentDetails.air_conditioning ? "Yes" : "No"}</p>
              </div>
            )}
            {apartmentDetails.parking !== undefined && (
              <div>
                <p className="text-sm text-muted-foreground">Parking</p>
                <p>{apartmentDetails.parking ? "Yes" : "No"}</p>
              </div>
            )}
            {apartmentDetails.elevator !== undefined && (
              <div>
                <p className="text-sm text-muted-foreground">Elevator</p>
                <p>{apartmentDetails.elevator ? "Yes" : "No"}</p>
              </div>
            )}
            {apartmentDetails.amenities &&
              apartmentDetails.amenities.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground">Amenities</p>
                  <div className="flex flex-wrap gap-1">
                    {apartmentDetails.amenities.map((amenity) => (
                      <Badge key={amenity}>{amenity}</Badge>
                    ))}
                  </div>
                </div>
              )}
          </div>

          {isApartmentRent && (
            <div className="grid grid-cols-2 gap-4">
              {(apartmentDetails as IAdminApartmentRent)
                .contract_duration_months !== undefined && (
                <div>
                  <p className="text-sm text-muted-foreground">
                    Contract Duration (months)
                  </p>
                  <p>
                    {(apartmentDetails as IAdminApartmentRent)
                      .contract_duration_months}
                  </p>
                </div>
              )}
              {(apartmentDetails as IAdminApartmentRent).mortgage_available !==
                undefined && (
                <div>
                  <p className="text-sm text-muted-foreground">
                    Mortgage Available
                  </p>
                  <p>
                    {(apartmentDetails as IAdminApartmentRent)
                      .mortgage_available
                      ? "Yes"
                      : "No"}
                  </p>
                </div>
              )}
            </div>
          )}

          <div>
            <p className="text-sm text-muted-foreground">Description</p>
            <p>{property.description.en}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Address</p>
            <p>{property.address.en}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Photos</p>
            <div className="flex flex-wrap gap-4">
              {property.photos?.map((photo, index) => (
                <img
                  key={photo}
                  src={photo}
                  alt="property"
                  className="w-32 h-32 object-cover rounded-md cursor-pointer"
                  onClick={() => {
                    setCurrentMediaIndex(index);
                    setIsGalleryOpen(true);
                  }}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
        <DialogContent className="sm:max-w-screen w-full h-screen max-w-none rounded-none border-none p-0 bg-black top-0 left-0 translate-x-0 translate-y-0">
          <DialogClose className="absolute top-4 right-4 text-white z-50">
            <X className="h-6 w-6" />
          </DialogClose>
          <Carousel
            opts={{ startIndex: currentMediaIndex, loop: true }}
            className="w-full h-full flex items-center justify-center"
          >
            <CarouselContent className="h-full">
              {property.photos?.map((photo, index) => (
                <CarouselItem
                  key={index}
                  className="flex items-center justify-center h-full"
                >
                  <img
                    src={photo}
                    alt=""
                    className="max-h-full max-w-full object-contain"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            {property.photos && property.photos.length > 1 && (
              <>
                <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-white/20 backdrop-blur-xl hover:bg-white/40 border border-white/30 shadow-2xl hover:scale-110 transition-all" />
                <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-white/20 backdrop-blur-xl hover:bg-white/40 border border-white/30 shadow-2xl hover:scale-110 transition-all" />
              </>
            )}
          </Carousel>
        </DialogContent>
      </Dialog>
    </div>
  );
}
