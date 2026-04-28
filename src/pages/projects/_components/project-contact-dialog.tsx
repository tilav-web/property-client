import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Mail, MessageCircle, Phone, Send, Loader2 } from "lucide-react";
import { projectService } from "@/services/project.service";
import type {
  IProject,
  TContactMethod,
} from "@/interfaces/project/project.interface";
import { useUserStore } from "@/stores/user.store";

const METHODS: { key: TContactMethod; labelKey: string; icon: typeof Mail }[] =
  [
    { key: "chat", labelKey: "pages.project_contact.chat", icon: Send },
    { key: "email", labelKey: "pages.project_contact.email", icon: Mail },
    { key: "phone", labelKey: "pages.project_contact.phone", icon: Phone },
    {
      key: "whatsapp",
      labelKey: "pages.project_contact.whatsapp",
      icon: MessageCircle,
    },
    {
      key: "telegram",
      labelKey: "pages.project_contact.telegram",
      icon: Send,
    },
  ];

interface Props {
  project: IProject;
  open: boolean;
  onOpenChange: (next: boolean) => void;
}

export default function ProjectContactDialog({
  project,
  open,
  onOpenChange,
}: Props) {
  const { t } = useTranslation();
  const user = useUserStore((s) => s.user);
  const [method, setMethod] = useState<TContactMethod>("chat");
  const [fullName, setFullName] = useState(
    user ? `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim() : "",
  );
  const [email, setEmail] = useState(user?.email?.value ?? "");
  const [phone, setPhone] = useState(user?.phone?.value ?? "");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const requiresEmail = method === "email";
  const requiresPhone = ["phone", "whatsapp", "telegram"].includes(method);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toast.error(t("pages.project_contact.error_name", "Ism kiriting"));
      return;
    }
    if (requiresEmail && !email.trim()) {
      toast.error(t("pages.project_contact.error_email", "Email kiriting"));
      return;
    }
    if (requiresPhone && !phone.trim()) {
      toast.error(
        t("pages.project_contact.error_phone", "Telefon kiriting"),
      );
      return;
    }

    setSubmitting(true);
    try {
      await projectService.submitInquiry({
        project: project._id,
        full_name: fullName.trim(),
        contact_method: method,
        email: requiresEmail ? email.trim() : email.trim() || undefined,
        phone: requiresPhone ? phone.trim() : phone.trim() || undefined,
        message: message.trim() || undefined,
      });
      toast.success(
        t("pages.project_contact.success", "So'rovingiz yuborildi!"),
      );
      onOpenChange(false);
      setMessage("");
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {t("pages.project_contact.title", "Loyiha bo'yicha so'rov")}
          </DialogTitle>
          <DialogDescription>
            {project.name}{" "}
            {typeof project.developer === "object"
              ? `— ${project.developer.name}`
              : ""}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Method select */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              {t("pages.project_contact.method", "Aloqa usuli")}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {METHODS.map((m) => {
                const Icon = m.icon;
                const active = method === m.key;
                return (
                  <button
                    key={m.key}
                    type="button"
                    onClick={() => setMethod(m.key)}
                    className={cn(
                      "flex flex-col items-center gap-1 rounded-lg border px-2 py-2 text-xs font-medium transition-colors",
                      active
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 hover:border-gray-300",
                    )}
                  >
                    <Icon size={16} />
                    {t(m.labelKey)}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              {t("pages.project_contact.full_name", "Ism-familiya")} *
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            />
          </div>

          {(requiresEmail || method === "chat") && (
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                {t("pages.project_contact.email", "Email")}{" "}
                {requiresEmail && "*"}
              </label>
              <input
                type="email"
                required={requiresEmail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
              />
            </div>
          )}

          {(requiresPhone || method === "chat") && (
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                {t("pages.project_contact.phone", "Telefon")}{" "}
                {requiresPhone && "*"}
              </label>
              <input
                type="tel"
                required={requiresPhone}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+998..."
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
              />
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              {t("pages.project_contact.message_label", "Xabar (ixtiyoriy)")}
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={1000}
              placeholder={t(
                "pages.project_contact.message_placeholder",
                "Qiziqishingiz haqida yozing...",
              )}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <Button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("pages.project_contact.submit", "So'rovni yuborish")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
