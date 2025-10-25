import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data, resetData } = useCreatePropertyStore();
  const [currentTab, setCurrentTab] = useState("media");
  const [completedTabs, setCompletedTabs] = useState<string[]>([]);

  const tabOrder = ["media", "info", "details", "price", "location"];

  const validateTab = (tab: string): boolean => {
    if (!data) return false;
    switch (tab) {
      case "media":
        return !!data.contract_file && !!data.photos && data.photos.length > 0;
      case "info":
        return (
          !!data.title?.uz &&
          !!data.title?.ru &&
          !!data.title?.en &&
          !!data.description?.uz &&
          !!data.description?.ru &&
          !!data.description?.en &&
          !!data.category
        );
      case "details":
        return true;
      case "price":
        return data.price !== undefined && data.price > 0 && !!data.price_type;
      case "location":
        return (
          !!data.address?.uz &&
          !!data.address?.ru &&
          !!data.address?.en &&
          !!data.location &&
          !!data.region &&
          !!data.district
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
      toast.error(t("common.error"), {
        description: t("pages.create_property.validation.fill_required_fields"),
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
      toast.error(t("common.error"), {
        description: t("pages.create_property.validation.fill_required_fields"),
      });
      return;
    }

    try {
      if (!data) return;

      const formData = new FormData();

      // Tillarni alohida propertylar sifatida yuborish
      if (data.title) {
        formData.append("title[uz]", data.title.uz || "");
        formData.append("title[ru]", data.title.ru || "");
        formData.append("title[en]", data.title.en || "");
      }

      if (data.description) {
        formData.append("description[uz]", data.description.uz || "");
        formData.append("description[ru]", data.description.ru || "");
        formData.append("description[en]", data.description.en || "");
      }

      if (data.address) {
        formData.append("address[uz]", data.address.uz || "");
        formData.append("address[ru]", data.address.ru || "");
        formData.append("address[en]", data.address.en || "");
      }

      // Qolgan maydonlar
      Object.entries(data).forEach(([key, value]) => {
        if (value === undefined || value === null) return;

        // Agar til maydoni bo'lsa, o'tkazib yuboramiz (yuqorida qo'shildi)
        if (key === "title" || key === "description" || key === "address") {
          return;
        }

        if (key === "location") {
          // Location ni JSON string ga o'tkazish
          formData.append(key, JSON.stringify(value));
        } else if (key === "amenities" && Array.isArray(value)) {
          // Amenities ni alohida indexlar bilan yuborish
          value.forEach((amenity, index) => {
            formData.append(`amenities[${index}]`, amenity);
          });
        } else if (key === "photos" && Array.isArray(value)) {
          value.forEach((photo) => formData.append("photos", photo));
        } else if (key === "contract_file") {
          formData.append("contract_file", value, value.name);
        } else if (key === "video") {
          formData.append("video", value, value.name);
        } else if (key === "region" || key === "district") {
          // MongoDB ObjectId larni string sifatida yuborish
          formData.append(key, String(value));
        } else if (typeof value === "boolean") {
          // Boolean qiymatlarni string ga o'tkazish
          formData.append(key, value.toString());
        } else if (value instanceof Date) {
          // Date ni ISO string ga o'tkazish
          formData.append(key, value.toISOString());
        } else {
          formData.append(key, String(value));
        }
      });

      await propertyService.create(formData);
      toast.success(t("common.success"), {
        description: t("pages.create_property.validation.success_message"),
      });
      resetData();
      navigate("/seller/properties");
    } catch (err) {
      console.error(
        t("pages.create_property.validation.error_submitting"),
        err
      );
    }
  };

  const isTabDisabled = (tab: string) => {
    const tabIndex = tabOrder.indexOf(tab);
    if (tabIndex === 0) return false;

    const prevTab = tabOrder[tabIndex - 1];
    return !completedTabs.includes(prevTab);
  };

  const getTabStatus = (tab: string) => {
    if (completedTabs.includes(tab)) return "completed";
    if (currentTab === tab) return "current";
    return "pending";
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {t("pages.create_property.title")}
        </h1>
        <p className="text-gray-600 mt-2">
          {t("pages.create_property.subtitle")}
        </p>
      </div>

      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          {tabOrder.map((tab, index) => (
            <div key={tab} className="flex flex-col items-center flex-1">
              <div className="flex items-center w-full">
                {/* Connector line */}
                {index > 0 && (
                  <div
                    className={`flex-1 h-1 ${
                      completedTabs.includes(tabOrder[index - 1])
                        ? "bg-green-500"
                        : "bg-gray-200"
                    }`}
                  />
                )}

                {/* Step circle */}
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    getTabStatus(tab) === "completed"
                      ? "bg-green-500 text-white"
                      : getTabStatus(tab) === "current"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {getTabStatus(tab) === "completed"
                    ? t("pages.create_property.validation.check_mark")
                    : index + 1}
                </div>

                {/* Connector line */}
                {index < tabOrder.length - 1 && (
                  <div
                    className={`flex-1 h-1 ${
                      completedTabs.includes(tab)
                        ? "bg-green-500"
                        : "bg-gray-200"
                    }`}
                  />
                )}
              </div>

              {/* Tab label */}
              <span
                className={`text-xs mt-2 font-medium ${
                  getTabStatus(tab) === "completed"
                    ? "text-green-600"
                    : getTabStatus(tab) === "current"
                    ? "text-blue-600"
                    : "text-gray-500"
                }`}
              >
                {t(`pages.create_property.tabs.${tab}`)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-6">
          <TabsTrigger
            value="media"
            className={`flex flex-col h-auto py-3 ${
              getTabStatus("media") === "completed"
                ? "bg-green-50 text-green-700"
                : ""
            }`}
          >
            <span>{t("pages.create_property.tabs.media")}</span>
            <span className="text-xs font-normal mt-1">
              {t("pages.create_property.tabs.media_subtitle")}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="info"
            disabled={isTabDisabled("info")}
            className={`flex flex-col h-auto py-3 ${
              getTabStatus("info") === "completed"
                ? "bg-green-50 text-green-700"
                : ""
            }`}
          >
            <span>{t("pages.create_property.tabs.info")}</span>
            <span className="text-xs font-normal mt-1">
              {t("pages.create_property.tabs.info_subtitle")}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="details"
            disabled={isTabDisabled("details")}
            className={`flex flex-col h-auto py-3 ${
              getTabStatus("details") === "completed"
                ? "bg-green-50 text-green-700"
                : ""
            }`}
          >
            <span>{t("pages.create_property.tabs.details")}</span>
            <span className="text-xs font-normal mt-1">
              {t("pages.create_property.tabs.details_subtitle")}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="price"
            disabled={isTabDisabled("price")}
            className={`flex flex-col h-auto py-3 ${
              getTabStatus("price") === "completed"
                ? "bg-green-50 text-green-700"
                : ""
            }`}
          >
            <span>{t("pages.create_property.tabs.price")}</span>
            <span className="text-xs font-normal mt-1">
              {t("pages.create_property.tabs.price_subtitle")}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="location"
            disabled={isTabDisabled("location")}
            className={`flex flex-col h-auto py-3 ${
              getTabStatus("location") === "completed"
                ? "bg-green-50 text-green-700"
                : ""
            }`}
          >
            <span>{t("pages.create_property.tabs.location")}</span>
            <span className="text-xs font-normal mt-1">
              {t("pages.create_property.tabs.location_subtitle")}
            </span>
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

      <div className="flex items-center justify-between mt-8 gap-4">
        <div className="text-sm text-gray-500">
          {currentTab !== "media" && (
            <Button onClick={handlePrevious} variant="outline">
              {t("common.previous")}
            </Button>
          )}
        </div>

        <div className="flex items-center gap-4">
          {currentTab !== "location" ? (
            <Button
              onClick={handleNext}
              className="bg-blue-600 hover:bg-blue-700 min-w-32"
              size="lg"
            >
              {t("common.next")}
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              className="bg-green-600 hover:bg-green-700 min-w-32"
              size="lg"
            >
              {t("common.submit")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
