// components/property/PropertyForm.tsx
import { useState } from "react";
import type { CategoryType } from "@/interfaces/types/category.type";
import MediaSection from "./_components/media-section";
import BasicInfoSection from "./_components/basic-info-section";
import ApartmentSaleForm, {
  type ApartmentSaleFormData,
} from "./_components/category-forms/apartment-sale.form";
import ApartmentRentForm, {
  type ApartmentRentFormData,
} from "./_components/category-forms/apartment-rent.form";
import LocationSection from "./_components/location-section";
import SubmitSection from "./_components/submit-section";
import { propertyService } from "@/services/property.service";

type CategorySpecificData =
  | ApartmentSaleFormData
  | ApartmentRentFormData
  | Record<string, any>;

export default function PropertyForm() {
  const [category, setCategory] = useState<CategoryType | "">("");

  // Umumiy ma'lumotlar (b
  const [commonData, setCommonData] = useState<{
    title: string;
    description: string;
    address: string;
    price: string | number;
  }>({
    title: "",
    description: "",
    address: "",
    price: "",
  });

  const [location, setLocation] = useState({ lat: 41.2995, lng: 69.2401 });
  const [photos, setPhotos] = useState<{ file: File; preview: string }[]>([]);
  const [videos, setVideos] = useState<{ file: File; preview: string }[]>([]);

  // Har bir kategoriya o‘z holicha saqlaydi
  const [categoryData, setCategoryData] = useState<CategorySpecificData>({});

  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      // Append common data
      Object.entries(commonData).forEach(([key, value]) => {
        formData.append(key, String(value));
      });

      // Append category
      formData.append("category", category);

      // Append location
      formData.append("location_lat", String(location.lat));
      formData.append("location_lng", String(location.lng));

      // Append photos
      photos.forEach((p) => {
        formData.append("photos", p.file);
      });

      // Append videos
      videos.forEach((v) => {
        formData.append("videos", v.file);
      });

      // Append category-specific data
      Object.entries(categoryData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((item) => {
            formData.append(key, item);
          });
        } else {
          formData.append(key, value as string | Blob);
        }
      });

      const resData = await propertyService.create(formData);
      console.log("Form data submitted successfully:", resData);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const canSubmit = () => {
    return (
      photos.length > 0 &&
      commonData.title &&
      commonData.description &&
      commonData.address &&
      category &&
      Object.keys(categoryData).length > 0
    );
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <MediaSection
          photos={photos}
          setPhotos={setPhotos}
          videos={videos}
          setVideos={setVideos}
        />

        <BasicInfoSection
          data={commonData}
          setData={setCommonData}
          category={category}
          setCategory={setCategory}
        />

        {/* Kategoriyaga qarab maxsus forma */}
        {category === "APARTMENT_SALE" && (
          <ApartmentSaleForm
            data={categoryData as ApartmentSaleFormData}
            setData={setCategoryData}
          />
        )}
        {category === "APARTMENT_RENT" && (
          <ApartmentRentForm
            data={categoryData as ApartmentRentFormData}
            setData={setCategoryData}
          />
        )}

        <LocationSection location={location} setLocation={setLocation} />

        <SubmitSection onSubmit={handleSubmit} disabled={!canSubmit()} />
      </div>
    </div>
  );
}
