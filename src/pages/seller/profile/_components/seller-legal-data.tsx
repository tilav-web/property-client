import { useSellerStore } from "@/stores/seller.store";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Building2,
  CreditCard,
  User,
  FileText,
  Calendar,
  CheckCircle2,
  XCircle,
  Download,
  Share2,
  ClipboardList,
} from "lucide-react";
import { useTranslation } from "react-i18next";
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

export default function SellerLegalData() {
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

  const formatDate = (date: string | Date) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 space-y-6">
      {/* Hero header */}
      <SellerProfileHeader />

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-5">
        <TabsList className="bg-card border border-border/60 p-1 h-11">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-foreground data-[state=active]:text-background gap-1.5 rounded-full px-4"
          >
            <Building2 size={14} />
            {t("pages.seller_profile.tabs.overview", "Overview")}
          </TabsTrigger>
          <TabsTrigger
            value="business"
            className="data-[state=active]:bg-foreground data-[state=active]:text-background gap-1.5 rounded-full px-4"
          >
            <User size={14} />
            {t("pages.seller_profile.tabs.business", "Business")}
          </TabsTrigger>
          <TabsTrigger
            value="bank"
            className="data-[state=active]:bg-foreground data-[state=active]:text-background gap-1.5 rounded-full px-4"
          >
            <CreditCard size={14} />
            {t("pages.seller_profile.tabs.bank", "Bank")}
          </TabsTrigger>
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

        {/* OVERVIEW */}
        <TabsContent value="overview" className="space-y-5">
          <Section
            icon={<ClipboardList className="size-5" />}
            title={t("seller_data_page.general_details")}
            description={t("seller_data_page.business_information_status")}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Field
                label={t("seller_data_page.business_type")}
                value={
                  <span className="capitalize">
                    {seller.business_type.replace("_", " ")}
                  </span>
                }
              />
              <Field
                label={t("seller_data_page.passport")}
                value={seller.passport}
                mono
              />
              <Field
                label={t("seller_data_page.registration_status")}
                value={
                  seller.status === "approved" ? (
                    <span className="inline-flex items-center gap-1.5 text-emerald-700">
                      <CheckCircle2 className="size-4" />
                      {t("seller_data_page.registered")}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                      <XCircle className="size-4" />
                      {t("seller_data_page.not_registered")}
                    </span>
                  )
                }
              />
              <Field
                label={t("seller_data_page.created_at")}
                value={seller.createdAt && formatDate(seller.createdAt)}
              />
              <Field
                label={t("seller_data_page.updated_at")}
                value={seller.updatedAt && formatDate(seller.updatedAt)}
              />
            </div>
          </Section>
        </TabsContent>

        {/* BUSINESS (self-employed details) */}
        <TabsContent value="business" className="space-y-5">
          {seller.business_type === "self_employed" && seller.self_employed ? (
            <Section
              icon={<User className="size-5" />}
              title={t("seller_data_page.self_employed_details")}
              description={t(
                "pages.seller_data_page.personal_and_business_information",
              )}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <Field
                  label={t("seller_data_page.full_name")}
                  value={[
                    seller.self_employed.first_name,
                    seller.self_employed.middle_name,
                    seller.self_employed.last_name,
                  ]
                    .filter(Boolean)
                    .join(" ")}
                />
                <Field
                  label={t("seller_data_page.birth_date")}
                  value={
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="size-3.5 text-muted-foreground" />
                      {formatDate(seller.self_employed.birth_date)}
                    </span>
                  }
                />
                <Field
                  label={t("seller_data_page.jshshir")}
                  value={seller.self_employed.jshshir}
                  mono
                />
                <Field
                  label={t("seller_data_page.registration_number")}
                  value={seller.self_employed.registration_number}
                  mono
                />
                <Field
                  label={t("seller_data_page.registration_address")}
                  value={seller.self_employed.registration_address}
                />
                <Field
                  label={t("seller_data_page.vat_payer")}
                  value={
                    seller.self_employed.is_vat_payer ? (
                      <span className="inline-flex items-center gap-1.5 text-emerald-700">
                        <CheckCircle2 className="size-4" />
                        {t("seller_data_page.yes")}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">
                        {t("seller_data_page.no")}
                      </span>
                    )
                  }
                />
              </div>
            </Section>
          ) : (
            <div className="rounded-2xl border border-dashed border-border/60 bg-card/50 p-12 text-center">
              <User className="mx-auto size-10 text-muted-foreground/60" />
              <p className="mt-3 text-sm text-muted-foreground">
                {t(
                  "pages.seller_profile.no_business_data",
                  "No business details available",
                )}
              </p>
            </div>
          )}

          {seller.commissioner && (
            <Section
              icon={<Building2 className="size-5" />}
              title={t("seller_data_page.commissioner_details")}
              description={t(
                "pages.seller_data_page.contract_and_company_information",
              )}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <Field
                  label={t("seller_data_page.company")}
                  value={seller.commissioner.company}
                />
                <Field
                  label={t("seller_data_page.account_number")}
                  value={seller.commissioner.account_number}
                  mono
                />
                <Field
                  label={t("seller_data_page.contract_number")}
                  value={seller.commissioner.contract_number}
                  mono
                />
                <Field
                  label={t("seller_data_page.inn_or_jshshir")}
                  value={seller.commissioner.inn_or_jshshir}
                  mono
                />
                <Field
                  label={t("seller_data_page.mfo")}
                  value={seller.commissioner.mfo}
                  mono
                />
                <Field
                  label={t("seller_data_page.contract_start_date")}
                  value={
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="size-3.5 text-muted-foreground" />
                      {formatDate(seller.commissioner.contract_start_date)}
                    </span>
                  }
                />
                <Field
                  label={t("seller_data_page.contract_end_date")}
                  value={
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="size-3.5 text-muted-foreground" />
                      {formatDate(seller.commissioner.contract_end_date)}
                    </span>
                  }
                />
              </div>
            </Section>
          )}
        </TabsContent>

        {/* BANK */}
        <TabsContent value="bank" className="space-y-5">
          {seller.bank_account ? (
            <Section
              icon={<CreditCard className="size-5" />}
              title={t("seller_data_page.bank_account")}
              description={t("seller_data_page.your_banking_information")}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <Field
                  label={t("seller_data_page.bank_name")}
                  value={seller.bank_account.bank_name}
                />
                <Field
                  label={t("seller_data_page.account_number")}
                  value={seller.bank_account.account_number}
                  mono
                />
                <Field
                  label={t("seller_data_page.owner_full_name")}
                  value={seller.bank_account.owner_full_name}
                />
                <Field
                  label={t("seller_data_page.mfo")}
                  value={seller.bank_account.mfo}
                  mono
                />
                <Field
                  label={t("seller_data_page.swift_code")}
                  value={seller.bank_account.swift_code}
                  mono
                />
              </div>
            </Section>
          ) : (
            <div className="rounded-2xl border border-dashed border-border/60 bg-card/50 p-12 text-center">
              <CreditCard className="mx-auto size-10 text-muted-foreground/60" />
              <p className="mt-3 text-sm text-muted-foreground">
                {t(
                  "pages.seller_profile.no_bank_data",
                  "No bank account information",
                )}
              </p>
            </div>
          )}
        </TabsContent>

        {/* DOCUMENTS */}
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
              {seller.self_employed?.passport_file && (
                <DocCard
                  href={seller.self_employed.passport_file}
                  label={t("seller_data_page.passport_file")}
                  view={t("seller_data_page.view_document")}
                />
              )}
              {seller.self_employed?.self_employment_certificate && (
                <DocCard
                  href={seller.self_employed.self_employment_certificate}
                  label={t(
                    "pages.seller_data_page.self_employment_certificate",
                  )}
                  view={t("seller_data_page.view_document")}
                />
              )}
              {seller.self_employed?.vat_file && (
                <DocCard
                  href={seller.self_employed.vat_file}
                  label={t("seller_data_page.vat_file")}
                  view={t("seller_data_page.view_document")}
                />
              )}
              {seller.commissioner?.contract_file && (
                <DocCard
                  href={seller.commissioner.contract_file}
                  label={t("seller_data_page.contract_file")}
                  view={t("seller_data_page.view_document")}
                />
              )}
            </div>
            {!seller.self_employed?.passport_file &&
              !seller.self_employed?.self_employment_certificate &&
              !seller.self_employed?.vat_file &&
              !seller.commissioner?.contract_file && (
                <div className="rounded-xl border border-dashed border-border/60 p-8 text-center">
                  <FileText className="mx-auto size-8 text-muted-foreground/60" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    {t(
                      "pages.seller_profile.no_documents",
                      "No documents uploaded",
                    )}
                  </p>
                </div>
              )}
          </Section>
        </TabsContent>

        {/* SOCIAL */}
        <TabsContent value="social" className="space-y-5">
          <SellerSocials />
        </TabsContent>
      </Tabs>
    </div>
  );
}
