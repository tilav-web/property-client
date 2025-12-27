import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next"; // Import useTranslation

export default function MortgageCalculator({ price }: { price: number }) {
  const { t } = useTranslation(); // Initialize useTranslation

  // O'zgaruvchan parametrlar
  const [downPaymentPercent, setDownPaymentPercent] = useState(30);
  const [loanTermMonths, setLoanTermMonths] = useState(48);
  const [interestRate, setInterestRate] = useState(18);

  // Property narxini tahrirlash uchun
  const [editablePrice, setEditablePrice] = useState(price);
  const [isEditingPrice, setIsEditingPrice] = useState(false);

  // Props o'zgarganda state ni yangilash
  useEffect(() => {
    setEditablePrice(price);
  }, [price]);

  // Hisob-kitoblar
  const downPaymentAmount = (editablePrice * downPaymentPercent) / 100;
  const loanAmount = editablePrice - downPaymentAmount;

  // Oylik to'lov hisoblanishi (Annuitet formula)
  const monthlyInterestRate = interestRate / 100 / 12;
  const monthlyPayment =
    loanAmount > 0
      ? (loanAmount *
          (monthlyInterestRate *
            Math.pow(1 + monthlyInterestRate, loanTermMonths))) /
        (Math.pow(1 + monthlyInterestRate, loanTermMonths) - 1)
      : 0;

  // Formatlash funksiyasi
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("uz-UZ").format(Math.round(num));
  };

  // Oylarni yilga aylantirish (pluralizatsiya bilan)
  const getYearsAndMonths = (totalMonths: number) => {
    const years = Math.floor(totalMonths / 12);
    const remainingMonths = totalMonths % 12;
    const parts: string[] = [];

    if (years > 0) {
      parts.push(t("mortgageCalculator.year_one", { count: years }));
    }

    if (remainingMonths > 0) {
      parts.push(t("mortgageCalculator.month_one", { count: remainingMonths }));
    }
    
    if (totalMonths === 0) {
        return `0 ${t("mortgageCalculator.month_other", { count: 0 })}`;
    }
    
    return parts.join(" ");
  };

  // Price input uchun format
  const formatPriceInput = (value: number) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  // Price inputdan qiymat olish
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, "");
    if (/^\d*$/.test(value)) {
      setEditablePrice(Number(value) || 0);
    }
  };

  // Tezkor narx variantlari
  const quickPriceOptions = [
    { label: "300M", value: 300000000 },
    { label: "500M", value: 500000000 },
    { label: "750M", value: 750000000 },
    { label: "1M", value: 1000000000 },
    { label: "1.5M", value: 1500000000 },
  ];

  return (
    <Card className="p-6 lg:p-8 bg-card shadow-lg">
      {/* Property ma'lumotlari header */}
      <div className="mb-8 pb-6 border-b">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Property narxi - tahrirlash uchun */}
          <div className="flex flex-col sm:items-end"> {/* Adjusted for better mobile alignment */}
            {isEditingPrice ? (
              <div className="flex items-center gap-2">
                <Input
                  value={formatPriceInput(editablePrice)}
                  onChange={handlePriceChange}
                  className="w-full sm:w-48 text-right font-bold text-lg"
                  placeholder={t("mortgageCalculator.placeholder_price")}
                />
                <span className="text-muted-foreground whitespace-nowrap">
                  {t("mortgageCalculator.currency")}
                </span>
                <Button
                  size="sm"
                  onClick={() => setIsEditingPrice(false)}
                  variant="ghost"
                >
                  {t("mortgageCalculator.save")}
                </Button>
              </div>
            ) : (
              <div className="flex flex-wrap items-end gap-2"> {/* Added flex-wrap for mobile */}
                <div className="text-right">
                  <p className="text-2xl sm:text-3xl font-bold"> {/* Adjusted font size */}
                    {formatNumber(editablePrice)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t("mortgageCalculator.currency")}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsEditingPrice(true)}
                >
                  {t("mortgageCalculator.edit")}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Tezkor narx tanlash */}
        <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-4"> {/* Added justify-center for mobile */}
          {quickPriceOptions.map((option) => (
            <Button
              key={option.value}
              variant={editablePrice === option.value ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setEditablePrice(option.value);
                setIsEditingPrice(false);
              }}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Chap tomon - Sozlamalar */}
        <div className="space-y-8">
          {/* Boshlang'ich to'lov */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="downPayment" className="text-base font-medium">
                {t("mortgageCalculator.down_payment")}
              </Label>
              <div className="text-right">
                <p className="text-2xl font-bold">{downPaymentPercent}%</p>
                <p className="text-sm text-muted-foreground">
                  {formatNumber(downPaymentAmount)}{" "}
                  {t("mortgageCalculator.currency")}
                </p>
              </div>
            </div>
            <Slider
              id="downPayment"
              value={[downPaymentPercent]}
              onValueChange={(value) => setDownPaymentPercent(value[0])}
              min={10}
              max={70}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>10%</span>
              <span>70%</span>
            </div>
          </div>

          {/* Kredit muddati */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="loanTerm" className="text-base font-medium">
                {t("mortgageCalculator.loan_term")}
              </Label>
              <div className="text-right">
                <p className="text-2xl font-bold">
                  {loanTermMonths}{" "}
                  {t("mortgageCalculator.month_other", { count: loanTermMonths })}
                </p>
                <p className="text-sm text-muted-foreground">
                  {getYearsAndMonths(loanTermMonths)}
                </p>
              </div>
            </div>
            <Slider
              id="loanTerm"
              value={[loanTermMonths]}
              onValueChange={(value) => setLoanTermMonths(value[0])}
              min={6}
              max={120}
              step={6}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>6 {t("mortgageCalculator.month_one", { count: 6 })}</span>
              <span>10 {t("mortgageCalculator.year_one", { count: 10 })}</span>
            </div>
          </div>

          {/* Foiz stavkasi */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="interestRate" className="text-base font-medium">
                {t("mortgageCalculator.annual_interest_rate")}
              </Label>
              <p className="text-2xl font-bold">{interestRate.toFixed(1)}%</p>
            </div>
            <Slider
              id="interestRate"
              value={[interestRate]}
              onValueChange={(value) => setInterestRate(value[0])}
              min={12}
              max={30}
              step={0.5}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>12%</span>
              <span>30%</span>
            </div>
          </div>

          {/* Reset button */}
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              setEditablePrice(price);
              setDownPaymentPercent(30);
              setLoanTermMonths(48);
              setInterestRate(18);
              setIsEditingPrice(false);
            }}
          >
            {t("mortgageCalculator.reset_to_default")}
          </Button>
        </div>

        {/* O'ng tomon - Natijalar */}
        <div className="flex flex-col justify-center space-y-8">
          {/* Kredit miqdori */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              {t("mortgageCalculator.loan_amount")}
            </p>
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-bold">{formatNumber(loanAmount)}</p>
              <span className="text-muted-foreground">
                {t("mortgageCalculator.currency")}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {t("mortgageCalculator.of_property_price", {
                percent: (100 - downPaymentPercent).toFixed(0),
              })}
            </p>
          </div>

          <div className="h-px bg-border" />

          {/* Oylik to'lov */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              {t("mortgageCalculator.monthly_payment")}
            </p>
            <div className="flex items-baseline gap-2">
              <p className="text-5xl font-bold text-primary">
                {formatNumber(monthlyPayment)}
              </p>
              <span className="text-muted-foreground">
                {t("mortgageCalculator.currency")}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {t("mortgageCalculator.for_months_duration", {
                count: loanTermMonths,
                duration: getYearsAndMonths(loanTermMonths),
              })}
            </p>
          </div>

          {/* Statistika kartalar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"> {/* Adjusted grid for responsiveness */}
            <Card className="p-4 bg-muted/50">
              <p className="text-xs text-muted-foreground mb-1">
                {t("mortgageCalculator.total_repayment")}
              </p>
              <p className="text-lg font-semibold">
                {formatNumber(
                  downPaymentAmount + monthlyPayment * loanTermMonths
                )}{" "}
                {t("mortgageCalculator.currency")}
              </p>
            </Card>
            <Card className="p-4 bg-muted/50">
              <p className="text-xs text-muted-foreground mb-1">
                {t("mortgageCalculator.total_interest")}
              </p>
              <p className="text-lg font-semibold">
                {formatNumber(monthlyPayment * loanTermMonths - loanAmount)}{" "}
                {t("mortgageCalculator.currency")}
              </p>
            </Card>
          </div>

          {/* Foiz stavkasi kartasi */}
          <Card className="p-4 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">
                  {t("mortgageCalculator.annual_interest_rate")}
                </p>
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {interestRate}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">
                  {t("mortgageCalculator.monthly_interest")}
                </p>
                <p className="text-xl font-bold">
                  {(interestRate / 12).toFixed(1)}%
                </p>
              </div>
            </div>
          </Card>

          {/* Eslatma */}
          <p className="text-xs text-muted-foreground italic pt-2 border-t">
            {t("mortgageCalculator.disclaimer1")}
            <br />
            {t("mortgageCalculator.disclaimer2")}
          </p>
        </div>
      </div>
    </Card>
  );
}