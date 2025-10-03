import { Mail } from "lucide-react";

export default function MailButton({ mail }: { mail: string }) {
  return (
    <a
      href={`mailto:${mail}`}
      className="bg-white flex items-center gap-2 px-3 py-2 rounded border border-black text-sm min-w-0"
    >
      <Mail className="w-4 h-4" />
      <span className="hidden sm:inline">Email</span>
    </a>
  );
}
