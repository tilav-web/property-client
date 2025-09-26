import { ClipboardPenLine } from "lucide-react";

export default function OnlineContractButton() {
  return (
    <button className="bg-white flex items-center gap-2 px-3 py-2 rounded border border-black text-sm min-w-0">
      <ClipboardPenLine className="w-4 h-4" />
      <span className="whitespace-nowrap">Онлайн контракт</span>
    </button>
  );
}
