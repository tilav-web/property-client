import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Languages } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useCreatePropertyStore } from "@/stores/create-property.store";
import {
  propertyCategory,
  propertyConstructionStatus,
} from "@/interfaces/property.interface";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function InfoTab() {
  const { t } = useTranslation();
  const { data, updateData, updateTitle, updateDescription } =
    useCreatePropertyStore();

  // Til kodlari
  const languages = [
    { code: "uz", label: "O'zbekcha" },
    { code: "ru", label: "Русский" },
    { code: "en", label: "English" },
  ] as const;

  // Umumiy handler (faqat string maydonlar uchun)
  const handleChange = (key: string, value: string) => {
    updateData({ [key]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Home className="h-5 w-5" />
          {t("pages.create_property.info_tab.main_info")}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Tillar bo'yicha tablar */}
        <Tabs defaultValue="uz" className="w-full">
          <div className="flex items-center gap-2 mb-4">
            <Languages className="h-4 w-4 text-gray-500" />
            <TabsList>
              {languages.map((lang) => (
                <TabsTrigger key={lang.code} value={lang.code}>
                  {lang.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {languages.map((lang) => (
            <TabsContent
              key={lang.code}
              value={lang.code}
              className="space-y-4"
            >
              {/* Sarlavha */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("pages.create_property.info_tab.title_label")} * ({lang.label})
                </label>
                <Input
                  type="text"
                  placeholder={
                    lang.code === "uz"
                      ? "Masalan: Yangi qurilayotgan loyiha markazda..."
                      : lang.code === "ru"
                      ? "Например: Новый строящийся проект в центре..."
                      : "For example: New construction project in the center..."
                  }
                  value={data?.title?.[lang.code] ?? ""}
                  onChange={(e) => updateTitle(lang.code, e.target.value)}
                  maxLength={40}
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>{data?.title?.[lang.code]?.length ?? 0}/40</span>
                </div>
              </div>

              {/* Tavsif */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("pages.create_property.info_tab.description_label")} * ({lang.label})
                </label>
                <Textarea
                  placeholder={
                    lang.code === "uz"
                      ? "Mulkning batafsil tavsifini yozing..."
                      : lang.code === "ru"
                      ? "Напишите подробное описание собственности..."
                      : "Write a detailed description of the property..."
                  }
                  value={data?.description?.[lang.code] ?? ""}
                  onChange={(e) => updateDescription(lang.code, e.target.value)}
                  maxLength={140}
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>{data?.description?.[lang.code]?.length ?? 0}/140</span>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
          {/* Kategoriya */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("pages.create_property.info_tab.category_label")} *
            </label>
            <Select
              value={data?.category ?? ""}
              onValueChange={(value) => handleChange("category", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("common.choose")} />
              </SelectTrigger>
              <SelectContent>
                {propertyCategory.map((item) => {
                  return (
                    <SelectItem key={item} className="capitalize" value={item}>
                      {t(`enums.property_category.${item}`)}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Qurilish holati */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("pages.create_property.info_tab.construction_status_label")}
            </label>
            <Select
              value={data?.construction_status ?? ""}
              onValueChange={(value) =>
                handleChange("construction_status", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder={t("common.choose")} />
              </SelectTrigger>
              <SelectContent>
                {propertyConstructionStatus.map((item) => {
                  return (
                    <SelectItem className="capitalize" key={item} value={item}>
                      {t(`enums.construction_status.${item}`)}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Logo URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("pages.create_property.info_tab.logo_label")}
            </label>
            <Input
              type="text"
              placeholder="https://example.com/logo.png"
              value={data?.logo ?? ""}
              onChange={(e) => handleChange("logo", e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
