import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import type { IDeveloper } from "@/interfaces/developer/developer.interface";
import { adminDeveloperService } from "../../../_services/admin-developer.service";

interface Props {
  developer: IDeveloper | null;
  onSaved: () => void;
}

export default function DeveloperForm({ developer, onSaved }: Props) {
  const [name, setName] = useState(developer?.name ?? "");
  const [description, setDescription] = useState(developer?.description ?? "");
  const [website, setWebsite] = useState(developer?.website ?? "");
  const [email, setEmail] = useState(developer?.email ?? "");
  const [phone, setPhone] = useState(developer?.phone ?? "");
  const [whatsapp, setWhatsapp] = useState(developer?.whatsapp ?? "");
  const [telegram, setTelegram] = useState(developer?.telegram ?? "");
  const [country, setCountry] = useState(developer?.country ?? "");
  const [city, setCity] = useState(developer?.city ?? "");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Nom majburiy");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    if (description) formData.append("description", description);
    if (website) formData.append("website", website);
    if (email) formData.append("email", email);
    if (phone) formData.append("phone", phone);
    if (whatsapp) formData.append("whatsapp", whatsapp);
    if (telegram) formData.append("telegram", telegram);
    if (country) formData.append("country", country);
    if (city) formData.append("city", city);
    if (logoFile) formData.append("logo", logoFile);
    if (coverFile) formData.append("cover", coverFile);

    setSubmitting(true);
    try {
      if (developer) {
        await adminDeveloperService.update(developer._id, formData);
        toast.success("Yangilandi");
      } else {
        await adminDeveloperService.create(formData);
        toast.success("Yaratildi");
      }
      onSaved();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Nomi *</Label>
        <Input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="EMAAR Properties"
        />
      </div>

      <div>
        <Label>Ta'rif</Label>
        <textarea
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Davlat</Label>
          <Input
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="Malaysia"
          />
        </div>
        <div>
          <Label>Shahar</Label>
          <Input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Kuala Lumpur"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Email</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <Label>Sayt</Label>
          <Input
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <Label>Telefon</Label>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div>
          <Label>WhatsApp</Label>
          <Input
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
          />
        </div>
        <div>
          <Label>Telegram</Label>
          <Input
            value={telegram}
            onChange={(e) => setTelegram(e.target.value)}
            placeholder="@username"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Logo</Label>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
          />
          {developer?.logo && !logoFile && (
            <img
              src={developer.logo}
              alt=""
              className="mt-2 h-16 w-32 object-contain"
            />
          )}
        </div>
        <div>
          <Label>Cover</Label>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
          />
          {developer?.cover && !coverFile && (
            <img
              src={developer.cover}
              alt=""
              className="mt-2 h-16 w-32 object-cover rounded"
            />
          )}
        </div>
      </div>

      <Button
        type="submit"
        disabled={submitting}
        className="w-full bg-blue-600 hover:bg-blue-700"
      >
        {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {developer ? "Yangilash" : "Yaratish"}
      </Button>
    </form>
  );
}
