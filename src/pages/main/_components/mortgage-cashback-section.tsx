import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Wallet } from "lucide-react";
import { toast } from "sonner";

export default function MortgageCashbackSection() {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const checks = [
    t(
      "pages.mortgage.check_resident",
      "You're a Malaysian resident or expat",
    ),
    t(
      "pages.mortgage.check_no_home",
      "You don't currently own a home in Malaysia",
    ),
    t(
      "pages.mortgage.check_amount",
      "You require a mortgage over RM 500,000",
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
      // Stub: connect to backend later
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
      <div className="grid grid-cols-1 gap-8 overflow-hidden rounded-3xl border border-border/60 bg-card p-8 lg:grid-cols-2 lg:p-12">
        <div>
          <div className="mb-4 inline-flex size-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
            <Wallet className="size-6" />
          </div>
          <h2 className="font-display text-3xl text-foreground sm:text-4xl">
            {t("pages.mortgage.title", "Mortgage Cashback")}
          </h2>
          <p className="mt-3 text-muted-foreground">
            {t(
              "pages.mortgage.subtitle",
              "Check if you qualify for 1% Mortgage Cashback:",
            )}
          </p>

          <ul className="mt-5 space-y-3">
            {checks.map((c) => (
              <li
                key={c}
                className="flex items-center gap-3 text-sm text-foreground"
              >
                <span className="flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Check className="size-3" />
                </span>
                {c}
              </li>
            ))}
          </ul>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 self-center rounded-2xl border border-border/60 bg-background/50 p-6"
        >
          <div className="space-y-1.5">
            <Label htmlFor="mortgage-name" className="text-xs text-muted-foreground">
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
            <Label htmlFor="mortgage-phone" className="text-xs text-muted-foreground">
              {t("pages.mortgage.phone_label", "Phone number")}
            </Label>
            <div className="flex items-center gap-2">
              <span className="flex h-11 items-center gap-1.5 rounded-xl border border-border bg-card px-3 text-sm font-medium text-foreground">
                🇲🇾 +60
              </span>
              <Input
                id="mortgage-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="123456789"
                required
              />
            </div>
          </div>
          <Button type="submit" disabled={submitting} size="lg">
            {submitting
              ? t("common.loading", "Loading...")
              : t("pages.mortgage.apply", "Apply")}
          </Button>
        </form>
      </div>
    </section>
  );
}
