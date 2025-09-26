import { Phone } from "lucide-react";

export default function CallButton() {
  return (
    <button className="bg-white flex items-center gap-2 px-3 py-2 rounded border border-black text-sm min-w-0">
      <Phone className="w-4 h-4" />
      <span className="hidden sm:inline">Вызов</span>
    </button>
  );
}
