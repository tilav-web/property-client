"use client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MediaTab from "./create-property-tabs/media-tab";
import InfoTab from "./create-property-tabs/info-tab";
import DetailsTab from "./create-property-tabs/details-tab";
import PriceTab from "./create-property-tabs/price-tab";
import LocationTab from "./create-property-tabs/location-tab";
import { propertyService } from "@/services/property.service";
import { useCreatePropertyStore } from "@/stores/create-property.store";

import { useState } from "react";
import { toast } from "sonner";

export default function CreateProperty() {
  const navigate = useNavigate();
  const { data, resetData } = useCreatePropertyStore();
  const [currentTab, setCurrentTab] = useState("media");
  const [completedTabs, setCompletedTabs] = useState<string[]>([]);

  const tabOrder = ["media", "info", "details", "price", "location"];

  const validateTab = (tab: string): boolean => {
    if (!data) return false;
    switch (tab) {
      case "media":
        return !!data.banner && !!data.photos && data.photos.length > 0;
      case "info":
        return !!data.title && !!data.description && !!data.category;
      case "details":
        return (
          data.bedrooms !== undefined &&
          data.bathrooms !== undefined &&
          data.floor_level !== undefined &&
          data.parking_spaces !== undefined
        );
      case "price":
        return (
          data.price !== undefined &&
          !!data.price_type &&
          data.area !== undefined
        );
      case "location":
        return (
          !!data.address && !!data.location && !!data.region && !!data.district
        );
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateTab(currentTab)) {
      if (!completedTabs.includes(currentTab)) {
        setCompletedTabs([...completedTabs, currentTab]);
      }
      const currentIndex = tabOrder.indexOf(currentTab);
      if (currentIndex < tabOrder.length - 1) {
        setCurrentTab(tabOrder[currentIndex + 1]);
      }
    } else {
      toast.error("Xatolik", {
        description: "Iltimos, barcha kerakli maydonlarni to'ldiring.",
      });
    }
  };

  const handlePrevious = () => {
    const currentIndex = tabOrder.indexOf(currentTab);
    if (currentIndex > 0) {
      setCurrentTab(tabOrder[currentIndex - 1]);
    }
  };

  const handleSubmit = async () => {
    if (!validateTab("location")) {
      toast.error("Xatolik", {
        description: "Iltimos, joylashuv ma'lumotlarini to'ldiring.",
      });
      return;
    }

    try {
      if (!data) return;

      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value === undefined || value === null) return;

        if (key === "location" || key === "amenities") {
          formData.append(key, JSON.stringify(value));
        } else if (key === "photos" && Array.isArray(value)) {
          value.forEach((photo) => formData.append("photos", photo));
        } else if (key === "banner") {
          formData.append(key, value, value.name);
        } else if (key === "video") {
          formData.append(key, value, value.name);
        } else {
          formData.append(key, String(value));
        }
      });

      await propertyService.create(formData);
      toast.success("Muvaffaqiyatli", {
        description: "Mulk muvaffaqiyatli yaratildi.",
      });
      resetData();
      navigate("/seller/properties");
    } catch (err) {
      console.error("Yuborishda xato:", err);
      toast.error("Xatolik", {
        description: "Mulk yaratishda xatolik yuz berdi.",
      });
    }
  };

  const isTabDisabled = (tab: string) => {
    const tabIndex = tabOrder.indexOf(tab);
    if (tabIndex === 0) return false;

    const prevTab = tabOrder[tabIndex - 1];
    return !completedTabs.includes(prevTab);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Yangi Mulk Qoʻshish
        </h1>
        <p className="text-gray-600 mt-2">
          Mulk haqida barcha kerakli maʼlumotlarni toʻldiring
        </p>
      </div>

      <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="info" disabled={isTabDisabled("info")}>
            Maʼlumot
          </TabsTrigger>
          <TabsTrigger value="details" disabled={isTabDisabled("details")}>
            Tafsilotlar
          </TabsTrigger>
          <TabsTrigger value="price" disabled={isTabDisabled("price")}>
            Narx
          </TabsTrigger>
          <TabsTrigger value="location" disabled={isTabDisabled("location")}>
            Joylashuv
          </TabsTrigger>
        </TabsList>

        <TabsContent value="media" className="mt-6">
          <MediaTab />
        </TabsContent>
        <TabsContent value="info" className="mt-6">
          <InfoTab />
        </TabsContent>
        <TabsContent value="details" className="mt-6">
          <DetailsTab />
        </TabsContent>
        <TabsContent value="price" className="mt-6">
          <PriceTab />
        </TabsContent>
        <TabsContent value="location" className="mt-6">
          <LocationTab />
        </TabsContent>
      </Tabs>

      <div className="flex items-center justify-end mt-8 gap-4">
        {currentTab !== "media" && (
          <Button onClick={handlePrevious} variant="outline">
            Oldingisi
          </Button>
        )}

        {currentTab !== "location" ? (
          <Button
            onClick={handleNext}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Keyingisi
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700"
          >
            Yuborish
          </Button>
        )}
      </div>
    </div>
  );
}
