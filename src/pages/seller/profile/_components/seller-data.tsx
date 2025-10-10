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

export default function SellerData() {
  const { seller } = useSellerStore();

  if (!seller) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <XCircle className="w-12 h-12 mx-auto text-muted-foreground" />
          <p className="text-muted-foreground">No seller data available</p>
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
            Seller Information
          </h1>
          <p className="text-muted-foreground">
            Manage and view your business details and documentation
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
                <CardTitle>General Details</CardTitle>
                <CardDescription>
                  Your business information and status
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Business Type</p>
                <p className="font-medium capitalize">
                  {seller?.business_type.replace("_", " ")}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Passport</p>
                <p className="font-medium font-mono">{seller?.passport}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Status</p>
                <div>{getStatusBadge(seller?.status)}</div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  Registration Status
                </p>
                <div className="flex items-center gap-2">
                  {seller?.status ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="font-medium">Registered</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-destructive" />
                      <span className="font-medium">Not Registered</span>
                    </>
                  )}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Created At</p>
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
                <p className="text-sm text-muted-foreground">Updated At</p>
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
                  <CardTitle>Bank Account</CardTitle>
                  <CardDescription>Your banking information</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Bank Name</p>
                  <p className="font-medium">
                    {seller?.bank_account.bank_name}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Account Number
                  </p>
                  <p className="font-medium font-mono">
                    {seller?.bank_account.account_number}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Owner Full Name
                  </p>
                  <p className="font-medium">
                    {seller?.bank_account.owner_full_name}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">MFO</p>
                  <p className="font-medium font-mono">
                    {seller?.bank_account.mfo}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">SWIFT Code</p>
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
                  <CardTitle>Self Employed Details</CardTitle>
                  <CardDescription>
                    Personal and business information
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Full Name</p>
                  <p className="font-medium">
                    {seller?.self_employed.first_name}{" "}
                    {seller?.self_employed.middle_name}{" "}
                    {seller?.self_employed.last_name}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Birth Date</p>
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
                  <p className="text-sm text-muted-foreground">JSHSHIR</p>
                  <p className="font-medium font-mono">
                    {seller?.self_employed.jshshir}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Registration Number
                  </p>
                  <p className="font-medium font-mono">
                    {seller?.self_employed.registration_number}
                  </p>
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <p className="text-sm text-muted-foreground">
                    Registration Address
                  </p>
                  <p className="font-medium">
                    {seller?.self_employed.registration_address}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">VAT Payer</p>
                  <div className="flex items-center gap-2">
                    {seller?.self_employed.is_vat_payer ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span className="font-medium">Yes</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">No</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <p className="text-sm font-medium">Documents</p>
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
                          Passport File
                        </p>
                        <p className="text-xs text-muted-foreground">
                          View document
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
                          Self Employment Certificate
                        </p>
                        <p className="text-xs text-muted-foreground">
                          View document
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
                        <p className="text-sm font-medium truncate">VAT File</p>
                        <p className="text-xs text-muted-foreground">
                          View document
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
                  <CardTitle>Commissioner Details</CardTitle>
                  <CardDescription>
                    Contract and company information
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Company</p>
                  <p className="font-medium">{seller?.commissioner.company}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Account Number
                  </p>
                  <p className="font-medium font-mono">
                    {seller?.commissioner.account_number}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Contract Number
                  </p>
                  <p className="font-medium font-mono">
                    {seller?.commissioner.contract_number}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    INN or JSHSHIR
                  </p>
                  <p className="font-medium font-mono">
                    {seller?.commissioner.inn_or_jshshir}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">MFO</p>
                  <p className="font-medium font-mono">
                    {seller?.commissioner.mfo}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Contract Start Date
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
                    Contract End Date
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
                    <p className="text-sm font-medium">Contract Document</p>
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
                        Contract File
                      </p>
                      <p className="text-xs text-muted-foreground">
                        View document
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
