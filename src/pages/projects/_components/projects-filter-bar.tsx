import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Filter, X } from "lucide-react";
import { developerService } from "@/services/developer.service";
import type { IDeveloper } from "@/interfaces/developer/developer.interface";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const STATUS_KEYS = ["pre_launch", "on_sale", "sold_out", "completed"] as const;
type StatusKey = (typeof STATUS_KEYS)[number];

export interface ProjectsFilterValues {
  search: string;
  status: StatusKey | "";
  developer: string;
  city: string;
  beds_min: string;
  beds_max: string;
  price_min: string;
  price_max: string;
  delivery_year: string;
}

interface Props {
  value: ProjectsFilterValues;
  onChange: (next: ProjectsFilterValues) => void;
  total?: number;
}

export default function ProjectsFilterBar({ value, onChange, total }: Props) {
  const { t } = useTranslation();
  const [developers, setDevelopers] = useState<IDeveloper[]>([]);
  const [draft, setDraft] = useState<ProjectsFilterValues>(value);

  useEffect(() => setDraft(value), [value]);

  useEffect(() => {
    let cancelled = false;
    developerService
      .list({ limit: 50 })
      .then((res) => {
        if (!cancelled) setDevelopers(res.items);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  const activeCount = useMemo(() => {
    let n = 0;
    if (value.status) n++;
    if (value.developer) n++;
    if (value.city) n++;
    if (value.beds_min || value.beds_max) n++;
    if (value.price_min || value.price_max) n++;
    if (value.delivery_year) n++;
    return n;
  }, [value]);

  const apply = () => onChange(draft);
  const clearAll = () =>
    onChange({
      search: "",
      status: "",
      developer: "",
      city: "",
      beds_min: "",
      beds_max: "",
      price_min: "",
      price_max: "",
      delivery_year: "",
    });

  return (
    <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-gray-200">
      <div className="flex flex-wrap items-center gap-2 p-3">
        <Input
          placeholder={t(
            "pages.projects.filters.search_placeholder",
            "Project, developer, area...",
          )}
          value={value.search}
          onChange={(e) => onChange({ ...value, search: e.target.value })}
          className="flex-1 min-w-[180px] max-w-md"
        />

        {/* Status pills */}
        <div className="flex items-center gap-1 overflow-x-auto">
          <button
            type="button"
            onClick={() => onChange({ ...value, status: "" })}
            className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              !value.status
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {t("common.all", "All")}
          </button>
          {STATUS_KEYS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() =>
                onChange({ ...value, status: value.status === s ? "" : s })
              }
              className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                value.status === s
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {t(`pages.projects.status.${s}`, s.replace("_", " "))}
            </button>
          ))}
        </div>

        {/* More filters popover */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              type="button"
            >
              <Filter size={14} />
              {t("pages.projects.filters.more", "More")}
              {activeCount > 0 && (
                <span className="ml-1 rounded-full bg-blue-600 px-1.5 text-[11px] font-bold text-white">
                  {activeCount}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 space-y-3">
            <div>
              <Label className="text-xs text-gray-500">
                {t("pages.projects.filters.developer", "Developer")}
              </Label>
              <select
                value={draft.developer}
                onChange={(e) =>
                  setDraft({ ...draft, developer: e.target.value })
                }
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="">
                  {t("common.all", "All")}
                </option>
                {developers.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label className="text-xs text-gray-500">
                {t("pages.projects.filters.city", "City")}
              </Label>
              <Input
                value={draft.city}
                onChange={(e) => setDraft({ ...draft, city: e.target.value })}
                placeholder="Kuala Lumpur"
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs text-gray-500">
                  {t("pages.projects.filters.beds_min", "Beds min")}
                </Label>
                <Input
                  type="number"
                  min="0"
                  value={draft.beds_min}
                  onChange={(e) =>
                    setDraft({ ...draft, beds_min: e.target.value })
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-500">
                  {t("pages.projects.filters.beds_max", "Beds max")}
                </Label>
                <Input
                  type="number"
                  min="0"
                  value={draft.beds_max}
                  onChange={(e) =>
                    setDraft({ ...draft, beds_max: e.target.value })
                  }
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs text-gray-500">
                  {t("pages.projects.filters.price_min", "Price min")}
                </Label>
                <Input
                  type="number"
                  min="0"
                  value={draft.price_min}
                  onChange={(e) =>
                    setDraft({ ...draft, price_min: e.target.value })
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-500">
                  {t("pages.projects.filters.price_max", "Price max")}
                </Label>
                <Input
                  type="number"
                  min="0"
                  value={draft.price_max}
                  onChange={(e) =>
                    setDraft({ ...draft, price_max: e.target.value })
                  }
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs text-gray-500">
                {t("pages.projects.filters.delivery_year", "Delivery year")}
              </Label>
              <Input
                type="number"
                min="2024"
                max="2040"
                value={draft.delivery_year}
                onChange={(e) =>
                  setDraft({ ...draft, delivery_year: e.target.value })
                }
                placeholder="2030"
                className="mt-1"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={clearAll}
                type="button"
              >
                <X size={14} className="mr-1" />
                {t("common.clear", "Clear")}
              </Button>
              <Button size="sm" onClick={apply} type="button">
                {t("common.apply", "Apply")}
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {activeCount > 0 && (
          <Button
            size="sm"
            variant="ghost"
            onClick={clearAll}
            className="text-red-600 hover:text-red-700"
            type="button"
          >
            <X size={14} className="mr-1" />
            {t("common.clear", "Clear")}
          </Button>
        )}

        {total !== undefined && (
          <span className="ml-auto text-xs text-gray-500">
            {total} {t("pages.projects.results", "results")}
          </span>
        )}
      </div>
    </div>
  );
}
