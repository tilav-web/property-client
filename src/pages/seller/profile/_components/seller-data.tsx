import { useSellerStore } from "@/stores/seller.store";
import { serverUrl } from "@/utils/shared";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Building2,
  CreditCard,
  User,
  FileText,
  Calendar,
  CheckCircle2,
  XCircle,
  Download,
} from "lucide-react";
import { useTranslation } from "react-i18next";

export default function SellerData() {
  const { seller } = useSellerStore();
  const { t } = useTranslation();

  if (!seller) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <XCircle className="w-12 h-12 mx-auto text-muted-foreground" />
          <p className="text-muted-foreground">{t("pages.seller_data_page.no_seller_data")}</p>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<
      string,
      "default" | "secondary" | "destructive" | "outline"
    > = {
      active: "default",
      pending: "secondary",
      inactive: "destructive",
    };
    return (
      <Badge variant={variants[status] || "outline"} className="capitalize">
        {status}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-balance">
            {t("pages.seller_data_page.seller_information")}
          </h1>
          <p className="text-muted-foreground">
            {t("pages.seller_data_page.manage_your_business")}
          </p>
        </div>

        {/* General Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent">
                <Building2 className="w-5 h-5 text-accent-foreground" />
              </div>
              <div>
                <CardTitle>{t("pages.seller_data_page.general_details")}</CardTitle>
                <CardDescription>
                  {t("pages.seller_data_page.business_information_status")}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{t("pages.seller_data_page.business_type")}</p>
                <p className="font-medium capitalize">
                  {seller?.business_type.replace("_", " ")}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{t("pages.seller_data_page.passport")}</p>
                <p className="font-medium font-mono">{seller?.passport}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{t("pages.seller_data_page.status")}</p>
                <div>{getStatusBadge(seller?.status)}</div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  {t("pages.seller_data_page.registration_status")}
                </p>
                <div className="flex items-center gap-2">
                  {seller?.status ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="font-medium">{t("pages.seller_data_page.registered")}</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-destructive" />
                      <span className="font-medium">{t("pages.seller_data_page.not_registered")}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{t("pages.seller_data_page.created_at")}</p>
                <p className="font-medium">
                  {seller?.createdAt &&
                    new Date(seller?.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{t("pages.seller_data_page.updated_at")}</p>
                <p className="font-medium">
                  {seller?.updatedAt &&
                    new Date(seller?.updatedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bank Account Details */}
        {seller?.bank_account && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent">
                  <CreditCard className="w-5 h-5 text-accent-foreground" />
                </div>
                <div>
                  <CardTitle>{t("pages.seller_data_page.bank_account")}</CardTitle>
                  <CardDescription>{t("pages.seller_data_page.your_banking_information")}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{t("pages.seller_data_page.bank_name")}</p>
                  <p className="font-medium">
                    {seller?.bank_account.bank_name}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    {t("pages.seller_data_page.account_number")}
                  </p>
                  <p className="font-medium font-mono">
                    {seller?.bank_account.account_number}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    {t("pages.seller_data_page.owner_full_name")}
                  </p>
                  <p className="font-medium">
                    {seller?.bank_account.owner_full_name}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{t("pages.seller_data_page.mfo")}</p>
                  <p className="font-medium font-mono">
                    {seller?.bank_account.mfo}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{t("pages.seller_data_page.swift_code")}</p>
                  <p className="font-medium font-mono">
                    {seller?.bank_account.swift_code}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Self Employed Details */}
        {seller?.business_type === "self_employed" && seller?.self_employed && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent">
                  <User className="w-5 h-5 text-accent-foreground" />
                </div>
                <div>
                  <CardTitle>{t("pages.seller_data_page.self_employed_details")}</CardTitle>
                  <CardDescription>
                    {t("pages.seller_data_page.personal_and_business_information")}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{t("pages.seller_data_page.full_name")}</p>
                  <p className="font-medium">
                    {seller?.self_employed.first_name}{" "}
                    {seller?.self_employed.middle_name}{" "}
                    {seller?.self_employed.last_name}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{t("pages.seller_data_page.birth_date")}</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <p className="font-medium">
                      {new Date(
                        seller?.self_employed.birth_date
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{t("pages.seller_data_page.jshshir")}</p>
                  <p className="font-medium font-mono">
                    {seller?.self_employed.jshshir}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    {t("pages.seller_data_page.registration_number")}
                  </p>
                  <p className="font-medium font-mono">
                    {seller?.self_employed.registration_number}
                  </p>
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <p className="text-sm text-muted-foreground">
                    {t("pages.seller_data_page.registration_address")}
                  </p>
                  <p className="font-medium">
                    {seller?.self_employed.registration_address}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{t("pages.seller_data_page.vat_payer")}</p>
                  <div className="flex items-center gap-2">
                    {seller?.self_employed.is_vat_payer ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span className="font-medium">{t("pages.seller_data_page.yes")}</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{t("pages.seller_data_page.no")}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <p className="text-sm font-medium">{t("pages.seller_data_page.documents")}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {seller?.self_employed.passport_file && (
                    <a
                      href={`${serverUrl}/uploads/files/${seller?.self_employed.passport_file.file_name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 rounded-lg border bg-card hover:bg-accent transition-colors group"
                    >
                      <div className="p-2 rounded-md bg-accent group-hover:bg-background">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {t("pages.seller_data_page.passport_file")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {t("pages.seller_data_page.view_document")}
                        </p>
                      </div>
                      <Download className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
                    </a>
                  )}
                  {seller?.self_employed.self_employment_certificate && (
                    <a
                      href={`${serverUrl}/uploads/files/${seller?.self_employed.self_employment_certificate.file_name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 rounded-lg border bg-card hover:bg-accent transition-colors group"
                    >
                      <div className="p-2 rounded-md bg-accent group-hover:bg-background">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {t("pages.seller_data_page.self_employment_certificate")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {t("pages.seller_data_page.view_document")}
                        </p>
                      </div>
                      <Download className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
                    </a>
                  )}
                  {seller?.self_employed.vat_file && (
                    <a
                      href={`${serverUrl}/uploads/files/${seller?.self_employed.vat_file.file_name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 rounded-lg border bg-card hover:bg-accent transition-colors group"
                    >
                      <div className="p-2 rounded-md bg-accent group-hover:bg-background">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{t("pages.seller_data_page.vat_file")}</p>
                        <p className="text-xs text-muted-foreground">
                          {t("pages.seller_data_page.view_document")}
                        </p>
                      </div>
                      <Download className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
                    </a>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Commissioner Details */}
        {seller?.commissioner && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent">
                  <Building2 className="w-5 h-5 text-accent-foreground" />
                </div>
                <div>
                  <CardTitle>{t("pages.seller_data_page.commissioner_details")}</CardTitle>
                  <CardDescription>
                    {t("pages.seller_data_page.contract_and_company_information")}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{t("pages.seller_data_page.company")}</p>
                  <p className="font-medium">{seller?.commissioner.company}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    {t("pages.seller_data_page.account_number")}
                  </p>
                  <p className="font-medium font-mono">
                    {seller?.commissioner.account_number}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    {t("pages.seller_data_page.contract_number")}
                  </p>
                  <p className="font-medium font-mono">
                    {seller?.commissioner.contract_number}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    {t("pages.seller_data_page.inn_or_jshshir")}
                  </p>
                  <p className="font-medium font-mono">
                    {seller?.commissioner.inn_or_jshshir}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{t("pages.seller_data_page.mfo")}</p>
                  <p className="font-medium font-mono">
                    {seller?.commissioner.mfo}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    {t("pages.seller_data_page.contract_start_date")}
                  </p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <p className="font-medium">
                      {new Date(
                        seller?.commissioner.contract_start_date
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    {t("pages.seller_data_page.contract_end_date")}
                  </p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <p className="font-medium">
                      {new Date(
                        seller?.commissioner.contract_end_date
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Contract Document */}
              {seller?.commissioner.contract_file && (
                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <p className="text-sm font-medium">{t("pages.seller_data_page.contract_document")}</p>
                  </div>
                  <a
                    href={`${serverUrl}/uploads/files/${seller?.commissioner.contract_file.file_name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 rounded-lg border bg-card hover:bg-accent transition-colors group max-w-md"
                  >
                    <div className="p-2 rounded-md bg-accent group-hover:bg-background">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {t("pages.seller_data_page.contract_file")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t("pages.seller_data_page.view_document")}
                      </p>
                    </div>
                    <Download className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
