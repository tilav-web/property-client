import NextButton from "@/components/common/buttons/next-button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

export default function BusinessTypeTab({
  handleSelectTab,
}: {
  handleSelectTab: (tab: string) => void;
}) {
  const [businessType, setBusinessType] = useState<string>("ytt");
  const [params, setSearchParams] = useSearchParams();
  const business_type = params.get("business_type");
  const { t } = useTranslation();

  useEffect(() => {
    if (business_type) {
      setBusinessType(business_type);
    }
  }, [business_type, setSearchParams]);

  const handleSelectBusinessType = () => {
    setSearchParams({
      business_type: businessType,
    });
    handleSelectTab("user_details");
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">
        {t("business_type_tab.choose_business_type")}
      </h3>
      <p className="text-sm text-gray-600">
        {t("business_type_tab.choose_one_of_the_following")}
      </p>

      <RadioGroup
        value={businessType}
        onValueChange={(value) => setBusinessType(value)}
        className="flex flex-col gap-4"
      >
        <div className="flex items-center h-12 px-2 gap-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
          <RadioGroupItem
            value="ytt"
            id="ytt"
            className="text-blue-600 border-blue-600"
          />
          <Label
            htmlFor="ytt"
            className="text-base cursor-pointer flex-1 h-full"
          >
            {t("business_type_tab.individual_entrepreneur")}
          </Label>
        </div>

        <div className="flex items-center h-12 px-2 gap-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
          <RadioGroupItem
            value="mchj"
            id="mchj"
            className="text-blue-600 border-blue-600"
          />
          <Label
            htmlFor="mchj"
            className="text-base cursor-pointer flex-1 h-full"
          >
            {t("business_type_tab.llc_or_other_legal_entity")}
          </Label>
        </div>
      </RadioGroup>
      <div className="flex justify-end">
        <NextButton onClick={handleSelectBusinessType} loading={false} />
      </div>
    </div>
  );
}
