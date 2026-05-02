import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { propertyService } from "@/services/property.service";
import type { IProperty } from "@/interfaces/property/property.interface";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Bus,
  Car,
  ChevronLeft,
  ChevronRight,
  Footprints,
  MapPin,
  Search,
  Train,
} from "lucide-react";
import PropertyCard from "@/components/common/property-card";

const LANDMARKS = [
  "KLCC / Petronas Twin Towers",
  "KL Sentral",
  "Mid Valley",
  "Sunway Pyramid",
];

const MODES = [
  { key: "car", icon: Car },
  { key: "bus", icon: Bus },
  { key: "train", icon: Train },
  { key: "walk", icon: Footprints },
] as const;

type Mode = (typeof MODES)[number]["key"];

export default function TravelTimesSection() {
  const { t } = useTranslation();
  const [landmark, setLandmark] = useState(LANDMARKS[0]);
  const [travelTime, setTravelTime] = useState(15);
  const [peakHours, setPeakHours] = useState(false);
  const [mode, setMode] = useState<Mode>("car");

  const { data, isLoading } = useQuery({
    queryKey: ["travel-times-listings"],
    queryFn: () => propertyService.findAll({ limit: 8, sample: true }),
    staleTime: 5 * 60 * 1000,
  });

  const properties = data?.properties ?? [];

  return (
    <section className="py-12">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr] lg:gap-8">
        {/* Left — search controls */}
        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-card sm:p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex size-12 flex-shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-primary">
              <Train className="size-6" />
            </div>
            <h3 className="font-display text-lg font-semibold leading-tight text-foreground">
              {t("pages.travel_times.title", "Search by travel times")}
            </h3>
          </div>

          <div className="space-y-5">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">
                {t("pages.travel_times.location_label", "Selected location")}
              </Label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <select
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  className="h-10 w-full appearance-none rounded-xl border border-input bg-background pl-9 pr-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  {LANDMARKS.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium text-muted-foreground">
                  {t("pages.travel_times.max_time", "Max travel time")}
                </Label>
                <span className="text-xs font-semibold text-foreground">
                  {travelTime} {t("pages.travel_times.mins", "mins")}
                </span>
              </div>
              <input
                type="range"
                min={5}
                max={60}
                step={5}
                value={travelTime}
                onChange={(e) => setTravelTime(Number(e.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-muted accent-primary"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium text-muted-foreground">
                {t("pages.travel_times.peak_hours", "Peak hours")}
              </Label>
              <Switch checked={peakHours} onCheckedChange={setPeakHours} />
            </div>

            <div className="grid grid-cols-4 gap-2">
              {MODES.map(({ key, icon: Icon }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setMode(key)}
                  className={cn(
                    "flex h-10 items-center justify-center rounded-xl border transition-all",
                    mode === key
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-card text-muted-foreground hover:border-foreground/30 hover:text-foreground",
                  )}
                  aria-label={key}
                >
                  <Icon className="size-4" />
                </button>
              ))}
            </div>

            <Link to="/search" className="block">
              <Button type="button" size="lg" className="w-full">
                {t("pages.travel_times.confirm", "Confirm")}
              </Button>
            </Link>
          </div>
        </div>

        {/* Right — properties carousel */}
        <div className="min-w-0">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground sm:text-sm">
              <Car className="size-4 text-primary" />
              {t("pages.travel_times.tag_prefix", "max")}{" "}
              <strong className="font-bold">
                {travelTime} {t("pages.travel_times.mins", "mins")}
              </strong>{" "}
              {t("pages.travel_times.tag_to", "to")}{" "}
              <span className="font-semibold">{landmark}</span>
            </div>

            <div className="hidden gap-2 sm:flex">
              <button
                type="button"
                aria-label="Prev"
                onClick={() =>
                  document
                    .getElementById("travel-carousel")
                    ?.scrollBy({ left: -340, behavior: "smooth" })
                }
                className="flex size-9 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                type="button"
                aria-label="Next"
                onClick={() =>
                  document
                    .getElementById("travel-carousel")
                    ?.scrollBy({ left: 340, behavior: "smooth" })
                }
                className="flex size-9 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex gap-4 overflow-x-hidden">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-80 w-[280px] flex-shrink-0 animate-pulse rounded-2xl bg-muted/60 sm:w-[320px]"
                />
              ))}
            </div>
          ) : (
            <div
              id="travel-carousel"
              className="hide-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2"
            >
              {properties.map((p: IProperty) => (
                <div
                  key={p._id}
                  className="w-[280px] flex-shrink-0 snap-start sm:w-[320px]"
                >
                  <div className="relative">
                    <PropertyCard property={p} />
                    <div className="absolute bottom-2 left-2 right-2 flex items-center gap-1.5 rounded-lg bg-foreground/85 px-2.5 py-1 text-[11px] font-medium text-background backdrop-blur">
                      <MapPin className="size-3 text-primary" />
                      {t("pages.travel_times.tag_prefix", "max")} {travelTime}{" "}
                      {t("pages.travel_times.mins", "mins")}{" "}
                      {t("pages.travel_times.tag_to", "to")} {landmark}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Suppress unused warnings */}
          <span className="sr-only" aria-hidden>
            {peakHours ? "peak" : "off-peak"} {mode}
          </span>
        </div>
      </div>
    </section>
  );
}
