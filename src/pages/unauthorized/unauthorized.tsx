import { Button } from "@/components/ui/button";
import { ShieldOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center p-6">
      <div className="max-w-md">
        <ShieldOff className="mx-auto h-24 w-24 text-primary mb-6" />
        <h1 className="text-4xl font-bold text-foreground mb-2">
          Ruxsat Rad Etildi
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Kechirasiz, sizda ushbu sahifani ko'rish uchun kerakli ruxsatlar
          mavjud emas.
        </p>
        <Button onClick={() => navigate("/")} size="lg">
          Bosh sahifaga qaytish
        </Button>
      </div>
    </div>
  );
}
