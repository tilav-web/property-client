import { useTranslation } from "react-i18next";
import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { uz } from "date-fns/locale";

export default function DateRangePicker() {
  const { t, i18n } = useTranslation();
  const [date, setDate] = React.useState<{
    from: Date | undefined;
    to?: Date | undefined;
  }>({
    from: new Date(),
    to: new Date(),
  });

  const nights =
    date?.from && date?.to
      ? Math.ceil(
          (date.to.getTime() - date.from.getTime()) / (1000 * 60 * 60 * 24)
        )
      : 0;

  return (
    <div>
      <div className="mb-4">
        <p className="font-semibold text-lg">
          {nights > 0 ? `${nights} ${t("common.date_range_picker.nights")}` : t("common.date_range_picker.select_dates")}
        </p>
        {date?.from && date?.to && (
          <p className="text-sm text-gray-500">
            {date.from.toLocaleDateString(i18n.language, {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}{" "}
            –{" "}
            {date.to.toLocaleDateString(i18n.language, {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        )}
      </div>
      <Calendar
        autoFocus
        mode="range"
        defaultMonth={date?.from}
        selected={date}
        onSelect={setDate}
        numberOfMonths={2}
        locale={uz}
        className="rounded-md border shadow-sm w-full"
        required={true}
      />
    </div>
  );
}