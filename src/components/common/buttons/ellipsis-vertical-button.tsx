import { EllipsisVertical } from "lucide-react";

export default function EllipsisVerticalButton() {
  return (
    <button className="bg-[#FAD397] flex items-center gap-2 p-2 rounded border border-black">
      <EllipsisVertical className="w-4 h-4" />
    </button>
  );
}
