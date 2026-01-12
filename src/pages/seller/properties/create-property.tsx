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
import { propertyService } from "@/services/property.service";
import { usePropertyCreationStore } from "@/stores/property-creation.store";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { useNavigate } from "react-router-dom"; // Import useNavigate

type CategorySpecificData =
  | ApartmentSaleFormData
  | ApartmentRentFormData
  | Record<string, any>;

export default function PropertyForm() {
  const {
    step,
    photos,
    videos,
    category,
    commonData,
    categoryData,
    location,
    setPhotos,
    setVideos,
    setCategory,
    setCommonData,
    setCategoryData,
    setLocation,
    nextStep,
    prevStep,
    reset,
  } = usePropertyCreationStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = async () => {
    setIsSubmitting(true);
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
      toast.success("Property created successfully!");
      reset(); // Reset the form after successful submission
      navigate("/seller/properties"); // Redirect to properties page
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast.error(error.message || "Failed to create property.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const canGoNext = () => {
    switch (step) {
      case 1: // Photo Upload
        return photos.length > 0;
      case 2: // Video Upload (optional, always true to proceed if no videos)
        return true;
      case 3: // Basic Info, Category, Location, Category-Specific
        return (
          commonData.title &&
          commonData.description &&
          commonData.address &&
          category &&
          Object.keys(categoryData).length > 0 &&
          location.lat !== 41.2995 && // Assuming default is 41.2995
          location.lng !== 69.2401 // Assuming default is 69.2401
        );
      default:
        return false;
    }
  };

  const isFinalStep = step === 3; // Assuming 3 steps for now: Photos, Videos, Details
  // The original canSubmit logic will be moved to the final submit button
  const canSubmit = photos.length > 0 &&
  commonData.title &&
  commonData.description &&
  commonData.address &&
  category &&
  Object.keys(categoryData).length > 0;

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Step Indicators would go here */}
        <div className="mb-8 text-center text-lg font-semibold">
          Step {step} of 3
        </div>

        {step === 1 && (
          <MediaSection
            photos={photos}
            setPhotos={setPhotos}
            videos={videos} // Pass videos even if not used in this step yet, to avoid prop drilling
            setVideos={setVideos}
            mediaType="photos" // Indicate that this section is for photos
            isSubmitting={isSubmitting}
          />
        )}

        {step === 2 && (
          <MediaSection
            photos={photos}
            setPhotos={setPhotos}
            videos={videos}
            setVideos={setVideos}
            mediaType="videos" // Indicate that this section is for videos
            isSubmitting={isSubmitting}
          />
        )}

        {step === 3 && (
          <>
            <BasicInfoSection
              data={commonData}
              setData={setCommonData}
              category={category}
              setCategory={setCategory}
              isSubmitting={isSubmitting} // Pass isSubmitting prop
            />

            {/* Kategoriyaga qarab maxsus forma */}
                    {category === "APARTMENT_SALE" && (
                      <ApartmentSaleForm
                        data={categoryData as ApartmentSaleFormData}
                        setData={setCategoryData}
                        isSubmitting={isSubmitting} // Pass isSubmitting prop
                      />
                    )}            {category === "APARTMENT_RENT" && (
              <ApartmentRentForm
                data={categoryData as ApartmentRentFormData}
                setData={setCategoryData}
                isSubmitting={isSubmitting} // Pass isSubmitting prop
              />
            )}

            <LocationSection location={location} setLocation={setLocation} isSubmitting={isSubmitting} />
          </>
        )}

        <div className="mt-8 flex justify-between">
          {step > 1 && (
            <button
              onClick={prevStep}
              className="px-4 py-2 bg-gray-300 rounded-md"
              disabled={isSubmitting} // Disable during submission
            >
              Back
            </button>
          )}
          {!isFinalStep && (
            <button
              onClick={nextStep}
              disabled={!canGoNext() || isSubmitting} // Disable during submission
              className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-400 ml-auto"
            >
              Next
            </button>
          )}
          {isFinalStep && (
            <button
              onClick={handleSubmit}
              disabled={!canSubmit || isSubmitting}
              className="px-4 py-2 bg-green-500 text-white rounded-md disabled:bg-gray-400 ml-auto"
            >
              {isSubmitting ? "Submitting..." : "Submit Property"}
            </button>
          )}
        </div>
      </div>
      <Toaster />
    </div>
  );
}
