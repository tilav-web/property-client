// components/property/sections/SubmitSection.tsx
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

interface Props {
  onSubmit: () => void;
  disabled: boolean;
}

export default function SubmitSection({ onSubmit, disabled }: Props) {
  return (
    <div className="mt-12 pt-8 border-t-2 border-blue-100 text-center">
      <Button
        size="lg"
        onClick={onSubmit}
        disabled={disabled}
        className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-lg px-12 py-6"
      >
        <CheckCircle2 className="w-6 h-6 mr-3" />
        E'lonni joylashtirish
      </Button>

      {disabled && (
        <p className="mt-4 text-sm text-orange-600">
          Rasm, sarlavha, ta'rif, narx va kategoriya to'ldirilishi shart
        </p>
      )}
    </div>
  );
}