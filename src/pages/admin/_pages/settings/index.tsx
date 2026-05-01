import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Eye, EyeOff, KeyRound, Loader2, Settings, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAdminStore } from "@/stores/admin.store";
import { adminService } from "../../_services/admin.service";

export default function AdminSettingsPage() {
  const { admin, setProfile } = useAdminStore();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);

  useEffect(() => {
    if (admin) {
      setFirstName(admin.first_name ?? "");
      setLastName(admin.last_name ?? "");
      setEmail(admin.email ?? "");
    }
  }, [admin]);

  const profileMutation = useMutation({
    mutationFn: (payload: {
      first_name: string;
      last_name: string;
      email: string;
    }) => adminService.updateAdmin(admin!._id, payload),
    onSuccess: (data) => {
      setProfile(data);
      toast.success("Profil saqlandi");
    },
    onError: () => toast.error("Saqlashda xatolik"),
  });

  const passwordMutation = useMutation({
    mutationFn: (payload: { oldPassword: string; newPassword: string }) =>
      adminService.changePassword(payload),
    onSuccess: () => {
      toast.success("Parol o'zgartirildi");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    },
    onError: () => toast.error("Parolni o'zgartirishda xatolik"),
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!admin) return;
    profileMutation.mutate({
      first_name: firstName,
      last_name: lastName,
      email,
    });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Yangi parol va tasdiqlash mos kelmadi");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Yangi parol kamida 8 belgidan iborat bo'lishi kerak");
      return;
    }
    passwordMutation.mutate({ oldPassword, newPassword });
  };

  if (!admin) {
    return (
      <div className="p-6 text-muted-foreground">Yuklanmoqda...</div>
    );
  }

  const initials =
    (admin.first_name?.[0] ?? "") + (admin.last_name?.[0] ?? "");

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="mb-2 flex items-center gap-3">
        <Settings className="h-6 w-6 text-primary" />
        <div>
          <h1 className="font-display text-2xl text-foreground">
            Admin sozlamalari
          </h1>
          <p className="text-sm text-muted-foreground">
            Shaxsiy ma'lumotlaringiz va xavfsizlik
          </p>
        </div>
      </div>

      {/* Profile */}
      <form
        onSubmit={handleProfileSubmit}
        className="space-y-5 rounded-2xl border border-border/60 bg-card p-6"
      >
        <div className="flex items-center gap-4 pb-4 border-b border-border/60">
          <Avatar className="size-14 border border-border">
            <AvatarImage src={admin.avatar ?? ""} />
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
              {initials.toUpperCase() || "AD"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-display text-lg text-foreground flex items-center gap-2">
              <User size={16} />
              Profil
            </h2>
            <p className="text-xs text-muted-foreground">
              Ismingiz va elektron pochta
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="first_name">Ism</Label>
            <Input
              id="first_name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="last_name">Familiya</Label>
            <Input
              id="last_name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={profileMutation.isPending}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {profileMutation.isPending && (
              <Loader2 className="mr-2 size-4 animate-spin" />
            )}
            Saqlash
          </Button>
        </div>
      </form>

      {/* Password */}
      <form
        onSubmit={handlePasswordSubmit}
        className="space-y-5 rounded-2xl border border-border/60 bg-card p-6"
      >
        <div className="pb-4 border-b border-border/60">
          <h2 className="font-display text-lg text-foreground flex items-center gap-2">
            <KeyRound size={16} />
            Parolni o'zgartirish
          </h2>
          <p className="text-xs text-muted-foreground">
            Kuchli parol qo'llang (kamida 8 belgi)
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="old_password">Joriy parol</Label>
            <div className="relative">
              <Input
                id="old_password"
                type={showOld ? "text" : "password"}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowOld((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Toggle visibility"
              >
                {showOld ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="new_password">Yangi parol</Label>
            <div className="relative">
              <Input
                id="new_password"
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowNew((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Toggle visibility"
              >
                {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirm_password">Yangi parolni tasdiqlash</Label>
            <Input
              id="confirm_password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={passwordMutation.isPending}
            className="bg-foreground text-background hover:bg-foreground/90"
          >
            {passwordMutation.isPending && (
              <Loader2 className="mr-2 size-4 animate-spin" />
            )}
            Parolni o'zgartirish
          </Button>
        </div>
      </form>
    </div>
  );
}
