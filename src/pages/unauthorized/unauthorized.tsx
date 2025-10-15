import { Button } from "@/components/ui/button";
import { ShieldOff } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function Unauthorized() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center p-6">
      <div className="max-w-md">
        <ShieldOff className="mx-auto h-24 w-24 text-primary mb-6" />
        <h1 className="text-4xl font-bold text-foreground mb-2">
          {t("pages.unauthorized_page.access_denied")}
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          {t("pages.unauthorized_page.no_permission")}
        </p>
        <Button onClick={() => navigate("/")} size="lg">
          {t("pages.unauthorized_page.go_to_home")}
        </Button>
      </div>
    </div>
  );
}
