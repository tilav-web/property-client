import { Button } from "@/components/ui/button";
import { ArrowLeftToLine } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function BackTabsButton({ onClick }: { onClick: () => void }) {
  const { t } = useTranslation();
  return (
    <Button onClick={onClick} variant={"outline"}>
      <ArrowLeftToLine />
      <p>{t("common.buttons.back_tabs")}</p>
    </Button>
  );
}
