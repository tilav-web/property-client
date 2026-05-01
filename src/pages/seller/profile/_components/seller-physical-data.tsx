import { useSellerStore } from "@/stores/seller.store";
import {
  Calendar,
  CheckCircle2,
  CreditCard,
  Download,
  FileText,
  Share2,
  User,
  XCircle,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import SellerSocials from "./seller-socials";
import SellerProfileHeader from "./seller-profile-header";

interface FieldProps {
  label: string;
  value?: string | React.ReactNode;
  mono?: boolean;
}

function Field({ label, value, mono = false }: FieldProps) {
  return (
    <div className="space-y-1">
      <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
        {label}
      </p>
      <div
        className={`text-sm font-medium text-foreground ${mono ? "font-mono" : ""}`}
      >
        {value || <span className="text-muted-foreground/60">—</span>}
      </div>
    </div>
  );
}

interface SectionProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  children: React.ReactNode;
}

function Section({ icon, title, description, children }: SectionProps) {
  return (
    <section className="rounded-2xl border border-border/60 bg-card p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-accent text-foreground">
          {icon}
        </div>
        <div>
          <h2 className="font-display text-xl text-foreground">{title}</h2>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      {children}
    </section>
  );
}

interface DocCardProps {
  href: string;
  label: string;
  view: string;
}

function DocCard({ href, label, view }: DocCardProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-3 rounded-xl border border-border/60 bg-card p-4 transition-all hover:border-primary hover:bg-accent"
    >
      <div className="flex size-10 items-center justify-center rounded-lg bg-accent text-foreground transition-colors group-hover:bg-card">
        <FileText className="size-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground truncate">
          {label}
        </p>
        <p className="text-xs text-muted-foreground">{view}</p>
      </div>
      <Download className="size-4 text-muted-foreground transition-colors group-hover:text-foreground" />
    </a>
  );
}

export default function SellerPhysicalData() {
  const { seller } = useSellerStore();
  const { t } = useTranslation();

  if (!seller) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-3">
          <XCircle className="w-12 h-12 mx-auto text-muted-foreground" />
          <p className="text-muted-foreground">
            {t("seller_data_page.no_seller_data")}
          </p>
        </div>
      </div>
    );
  }

  const { self_employed, physical, business_type, passport, bank_account } =
    seller;

  const sellerData = business_type === "physical" ? physical : self_employed;

  if (!sellerData) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-3">
          <XCircle className="w-12 h-12 mx-auto text-muted-foreground" />
          <p className="text-muted-foreground">
            {t("pages.seller_profile.no_data_for_type", {
              type: business_type,
              defaultValue: `No data available for ${business_type} type`,
            })}
          </p>
        </div>
      </div>
    );
  }

  const {
    first_name,
    last_name,
    middle_name,
    birth_date,
    jshshir,
    passport_file,
  } = sellerData;
  const self_employment_certificate =
    "self_employment_certificate" in sellerData
      ? sellerData.self_employment_certificate
      : undefined;

  const formatDate = (date?: string | Date) =>
    date
      ? new Date(date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "";

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 space-y-6">
      <SellerProfileHeader />

      <Tabs defaultValue="overview" className="space-y-5">
        <TabsList className="bg-card border border-border/60 p-1 h-11">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-foreground data-[state=active]:text-background gap-1.5 rounded-full px-4"
          >
            <User size={14} />
            {t("pages.seller_profile.tabs.overview", "Overview")}
          </TabsTrigger>
          {bank_account && (
            <TabsTrigger
              value="bank"
              className="data-[state=active]:bg-foreground data-[state=active]:text-background gap-1.5 rounded-full px-4"
            >
              <CreditCard size={14} />
              {t("pages.seller_profile.tabs.bank", "Bank")}
            </TabsTrigger>
          )}
          <TabsTrigger
            value="documents"
            className="data-[state=active]:bg-foreground data-[state=active]:text-background gap-1.5 rounded-full px-4"
          >
            <FileText size={14} />
            {t("pages.seller_profile.tabs.documents", "Documents")}
          </TabsTrigger>
          <TabsTrigger
            value="social"
            className="data-[state=active]:bg-foreground data-[state=active]:text-background gap-1.5 rounded-full px-4"
          >
            <Share2 size={14} />
            {t("pages.seller_profile.tabs.social", "Social")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-5">
          <Section
            icon={<User className="size-5" />}
            title={t(
              "pages.seller_profile.personal_information",
              "Personal Information",
            )}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Field
                label={t("seller_data_page.first_name", "First Name")}
                value={first_name}
              />
              <Field
                label={t("seller_data_page.last_name", "Last Name")}
                value={last_name}
              />
              <Field
                label={t("seller_data_page.middle_name", "Middle Name")}
                value={middle_name}
              />
              <Field
                label={t("seller_data_page.birth_date", "Birth Date")}
                value={
                  birth_date && (
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="size-3.5 text-muted-foreground" />
                      {formatDate(birth_date)}
                    </span>
                  )
                }
              />
              <Field
                label={t("seller_data_page.passport", "Passport")}
                value={passport}
                mono
              />
              <Field
                label={t("seller_data_page.jshshir", "JSHShIR")}
                value={jshshir}
                mono
              />
            </div>
          </Section>
        </TabsContent>

        {bank_account && (
          <TabsContent value="bank" className="space-y-5">
            <Section
              icon={<CreditCard className="size-5" />}
              title={t("seller_data_page.bank_account")}
              description={t("seller_data_page.your_banking_information")}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <Field
                  label={t("seller_data_page.bank_name")}
                  value={bank_account.bank_name}
                />
                <Field
                  label={t("seller_data_page.account_number")}
                  value={bank_account.account_number}
                  mono
                />
                <Field
                  label={t("seller_data_page.owner_full_name")}
                  value={bank_account.owner_full_name}
                />
                <Field
                  label={t("seller_data_page.mfo")}
                  value={bank_account.mfo}
                  mono
                />
                <Field
                  label={t("seller_data_page.swift_code")}
                  value={bank_account.swift_code}
                  mono
                />
              </div>
            </Section>
          </TabsContent>
        )}

        <TabsContent value="documents" className="space-y-5">
          <Section
            icon={<FileText className="size-5" />}
            title={t("seller_data_page.documents")}
            description={t(
              "pages.seller_profile.documents_description",
              "All your verification documents",
            )}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {passport_file && (
                <DocCard
                  href={passport_file}
                  label={t("seller_data_page.passport_file")}
                  view={t("seller_data_page.view_document")}
                />
              )}
              {self_employment_certificate && (
                <DocCard
                  href={self_employment_certificate}
                  label={t(
                    "pages.seller_data_page.self_employment_certificate",
                  )}
                  view={t("seller_data_page.view_document")}
                />
              )}
            </div>
            {!passport_file && !self_employment_certificate && (
              <div className="rounded-xl border border-dashed border-border/60 p-8 text-center">
                <FileText className="mx-auto size-8 text-muted-foreground/60" />
                <p className="mt-2 text-sm text-muted-foreground">
                  {t(
                    "pages.seller_profile.no_documents",
                    "No documents uploaded",
                  )}
                </p>
                {!passport_file && (
                  <p className="mt-1 text-xs text-emerald-700 inline-flex items-center gap-1">
                    <CheckCircle2 className="size-3" />
                    {t(
                      "pages.seller_profile.complete_kyc_hint",
                      "Upload your passport to complete KYC",
                    )}
                  </p>
                )}
              </div>
            )}
          </Section>
        </TabsContent>

        <TabsContent value="social" className="space-y-5">
          <SellerSocials />
        </TabsContent>
      </Tabs>
    </div>
  );
}
