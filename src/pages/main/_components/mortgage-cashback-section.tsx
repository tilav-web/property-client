import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, PiggyBank } from "lucide-react";
import { toast } from "sonner";

export default function MortgageCashbackSection() {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const checks = [
    t(
      "pages.mortgage.check_resident",
      "You are a resident of Uzbekistan",
    ),
    t(
      "pages.mortgage.check_no_home",
      "You don't currently own a home",
    ),
    t(
      "pages.mortgage.check_amount",
      "You require a mortgage over 500,000,000 so'm",
    ),
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) {
      toast.error(
        t("pages.mortgage.phone_required", "Please enter your phone number"),
      );
      return;
    }
    setSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      toast.success(
        t(
          "pages.mortgage.success",
          "Thanks! We'll contact you within 24 hours.",
        ),
      );
      setName("");
      setPhone("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-12">
      <div className="overflow-hidden rounded-3xl border border-border/50 bg-accent/40">
        <div className="grid grid-cols-1 items-center gap-8 p-6 sm:p-10 lg:grid-cols-[1fr_auto] lg:gap-12">
          {/* Left — illustration + copy */}
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <div className="relative flex size-24 flex-shrink-0 items-center justify-center sm:size-32">
              <div className="absolute inset-0 rounded-full bg-primary/10" />
              <div className="relative flex size-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-card sm:size-20">
                <PiggyBank className="size-8 sm:size-10" />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="font-display text-2xl text-foreground sm:text-3xl">
                {t("pages.mortgage.title", "Mortgage Cashback!")}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                {t(
                  "pages.mortgage.subtitle",
                  "Check if you qualify for 1% Mortgage Cashback:",
                )}
              </p>
              <ul className="mt-4 space-y-2.5">
                {checks.map((c) => (
                  <li
                    key={c}
                    className="flex items-start gap-2.5 text-sm text-foreground"
                  >
                    <span className="mt-0.5 flex size-5 flex-shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                      <Check className="size-3" />
                    </span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right — form */}
          <form
            onSubmit={handleSubmit}
            className="flex w-full flex-col gap-4 rounded-2xl bg-card p-6 shadow-card lg:w-80"
          >
            <div className="space-y-1.5">
              <Label
                htmlFor="mortgage-name"
                className="text-xs text-muted-foreground"
              >
                {t("pages.mortgage.name_label", "Name (optional)")}
              </Label>
              <Input
                id="mortgage-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("pages.mortgage.name_placeholder", "Your name")}
              />
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="mortgage-phone"
                className="text-xs text-muted-foreground"
              >
                {t("pages.mortgage.phone_label", "Phone number")}
              </Label>
              <div className="flex items-center gap-2">
                <span className="flex h-10 items-center gap-1.5 rounded-xl border border-border bg-background px-3 text-sm font-medium text-foreground">
                  🇲🇾 +60
                </span>
                <Input
                  id="mortgage-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="123 456 789"
                  required
                />
              </div>
            </div>
            <Button
              type="submit"
              disabled={submitting}
              size="lg"
              className="w-full"
            >
              {submitting
                ? t("common.loading", "Loading...")
                : t("pages.mortgage.apply", "Apply")}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
