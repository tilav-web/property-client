import { Button } from "@/components/ui/button";
import { ArrowLeftToLine } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function BackButton() {
  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      // agar tarix bo'lmasa default sahifaga yuborish
      window.location.href = "/";
    }
  };
  const { t } = useTranslation();

  return (
    <Button className="capitalize" variant={"ghost"} onClick={handleBack}>
      <ArrowLeftToLine />
      {t("back")}
    </Button>
  );
}
