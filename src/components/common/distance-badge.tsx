import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  distanceMeters?: number | null;
  className?: string;
}

function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)} m`;
  const km = meters / 1000;
  return km < 10 ? `${km.toFixed(1)} km` : `${Math.round(km)} km`;
}

export default function DistanceBadge({ distanceMeters, className }: Props) {
  if (distanceMeters === undefined || distanceMeters === null) return null;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700",
        className,
      )}
    >
      <MapPin size={12} />
      {formatDistance(distanceMeters)}
    </span>
  );
}
