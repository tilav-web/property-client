import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export default function LoadMoreButton({
  loading,
  fetchNextPage,
}: {
  loading: boolean;
  fetchNextPage: () => void;
}) {
  const { t } = useTranslation();
  return (
    <Button onClick={() => fetchNextPage()} disabled={loading}>
      {loading
        ? t("common.buttons.loading_more")
        : t("common.buttons.load_more")}
    </Button>
  );
}
