import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ArrowRightToLine } from "lucide-react";

export default function NextButton({
  loading,
  onClick,
}: {
  loading: boolean;
  onClick: () => void;
}) {
  const { t } = useTranslation();
  return (
    <Button
      onClick={onClick}
      className="bg-blue-500 hover:bg-blue-500 active:bg-blue-800"
      type="button"
    >
      <p>{t("common.buttons.continue")}</p>
      {loading ? <Spinner /> : <ArrowRightToLine />}
    </Button>
  );
}
