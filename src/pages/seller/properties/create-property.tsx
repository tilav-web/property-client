import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function getMinPhotos(categoryData: Record<string, unknown>): number {
  const raw = (categoryData as { bedrooms?: number | string })?.bedrooms;
  const n = typeof raw === "string" ? Number(raw) : raw;
  if (typeof n === "number" && Number.isFinite(n) && n >= 1) {
    return Math.floor(n);
  }
  return 1;
}

export default function PropertyForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const minPhotos = getMinPhotos(categoryData as Record<string, unknown>);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(commonData).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
      formData.append("category", category);
      formData.append("location_lat", String(location.lat));
      formData.append("location_lng", String(location.lng));
      photos.forEach((p) => formData.append("photos", p.file));
      videos.forEach((v) => formData.append("videos", v.file));
      Object.entries(categoryData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((item) => formData.append(key, item));
        } else {
          formData.append(key, value as string | Blob);
        }
      });

      await propertyService.create(formData);
      toast.success(
        t("seller_create.success", { defaultValue: "Property created!" }),
      );
      reset();
      navigate("/seller/properties");
    } catch (error) {
      const msg =
        (error as { response?: { data?: { message?: string } } }).response?.data
          ?.message ??
        (error as Error).message ??
        "Failed to create property.";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const detailsReady =
    Boolean(commonData.title) &&
    Boolean(commonData.description) &&
    Boolean(commonData.address) &&
    Boolean(category) &&
    Object.keys(categoryData).length > 0 &&
    location.lat !== 3.139 &&
    location.lng !== 101.6869;

  const canGoNext = () => {
    switch (step) {
      case 1:
        return detailsReady;
      case 2:
        return photos.length >= minPhotos;
      case 3:
        return true;
      default:
        return false;
    }
  };

  const isFinalStep = step === 3;
  const canSubmit = detailsReady && photos.length >= minPhotos;

  const steps = [
    {
      num: 1,
      title: t("seller_create.step1", { defaultValue: "Details" }),
    },
    {
      num: 2,
      title: t("seller_create.step2", { defaultValue: "Photos" }),
    },
    {
      num: 3,
      title: t("seller_create.step3", { defaultValue: "Videos" }),
    },
  ];

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Step indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2 sm:gap-4">
            {steps.map((s, i) => {
              const done = step > s.num;
              const active = step === s.num;
              return (
                <div
                  key={s.num}
                  className="flex items-center gap-2 sm:gap-4"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors",
                        done &&
                          "border-green-500 bg-green-500 text-white",
                        active &&
                          "border-blue-500 bg-blue-500 text-white shadow-md",
                        !done &&
                          !active &&
                          "border-gray-300 bg-white text-gray-400",
                      )}
                    >
                      {done ? <Check size={14} /> : s.num}
                    </div>
                    <span
                      className={cn(
                        "hidden sm:inline text-sm font-medium",
                        active ? "text-blue-700" : "text-gray-500",
                      )}
                    >
                      {s.title}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div
                      className={cn(
                        "h-0.5 w-8 sm:w-16 rounded",
                        step > s.num ? "bg-green-500" : "bg-gray-200",
                      )}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {step === 1 && (
          <>
            <BasicInfoSection
              data={commonData}
              setData={setCommonData}
              category={category}
              setCategory={setCategory}
              isSubmitting={isSubmitting}
            />
            {category === "APARTMENT_SALE" && (
              <ApartmentSaleForm
                data={categoryData as ApartmentSaleFormData}
                setData={setCategoryData}
                isSubmitting={isSubmitting}
              />
            )}
            {category === "APARTMENT_RENT" && (
              <ApartmentRentForm
                data={categoryData as ApartmentRentFormData}
                setData={setCategoryData}
                isSubmitting={isSubmitting}
              />
            )}
            <LocationSection
              location={location}
              setLocation={setLocation}
              isSubmitting={isSubmitting}
            />
          </>
        )}

        {step === 2 && (
          <MediaSection
            photos={photos}
            setPhotos={setPhotos}
            videos={videos}
            setVideos={setVideos}
            mediaType="photos"
            minPhotos={minPhotos}
            isSubmitting={isSubmitting}
          />
        )}

        {step === 3 && (
          <MediaSection
            photos={photos}
            setPhotos={setPhotos}
            videos={videos}
            setVideos={setVideos}
            mediaType="videos"
            isSubmitting={isSubmitting}
          />
        )}

        <div className="mt-8 flex justify-between gap-3">
          {step > 1 ? (
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={isSubmitting}
            >
              <ChevronLeft size={16} className="mr-1" />
              {t("seller_create.back", { defaultValue: "Back" })}
            </Button>
          ) : (
            <span />
          )}
          {!isFinalStep ? (
            <Button
              onClick={nextStep}
              disabled={!canGoNext() || isSubmitting}
            >
              {t("seller_create.next", { defaultValue: "Next" })}
              <ChevronRight size={16} className="ml-1" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!canSubmit || isSubmitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting
                ? t("seller_create.submitting", {
                    defaultValue: "Submitting...",
                  })
                : t("seller_create.submit", {
                    defaultValue: "Submit Property",
                  })}
            </Button>
          )}
        </div>
      </div>
      <Toaster />
    </div>
  );
}
