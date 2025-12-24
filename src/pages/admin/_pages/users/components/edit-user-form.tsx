import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, UserRole } from "@/interfaces/users/user.interface";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { adminUserService } from "../../../_services/admin-user.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Loader2, CameraIcon, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface EditUserFormProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const formSchema = z.object({
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  role: z.nativeEnum(UserRole).optional(),
  lan: z.string().optional(),
  phone: z
    .object({
      value: z.string().optional(),
      isVerified: z.boolean().optional(),
    })
    .optional(),
  email: z
    .object({
      isVerified: z.boolean().optional(),
    })
    .optional(),
  avatar: z.string().nullable().optional(),
});

type FormData = z.infer<typeof formSchema>;

export function EditUserForm({ user, isOpen, onClose, onSuccess }: EditUserFormProps) {
  const queryClient = useQueryClient();
  const [avatarFile, setAvatarFile] = useState<File | undefined>(undefined);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      role: user?.role || UserRole.PHYSICAL,
      lan: user?.lan || "uz",
      phone: {
        value: user?.phone?.value || "",
        isVerified: user?.phone?.isVerified || false,
      },
      email: {
        isVerified: user?.email?.isVerified || false,
      },
      avatar: user?.avatar || null,
    },
  });

  // Reset form with new user data when dialog opens or user changes
  useEffect(() => {
    if (user) {
      form.reset({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        role: user.role,
        lan: user.lan,
        phone: {
          value: user.phone?.value || "",
          isVerified: user.phone?.isVerified || false,
        },
        email: {
          isVerified: user.email?.isVerified || false,
        },
        avatar: user.avatar || null,
      });
      setAvatarPreview(user.avatar || null);
      setAvatarFile(undefined);
    }
  }, [user, form]);

  const updateUserMutation = useMutation({
    mutationFn: (data: { userId: string; dto: FormData; avatarFile?: File }) =>
      adminUserService.update(data.userId, data.dto, data.avatarFile),
    onSuccess: () => {
      toast.success("User updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      onSuccess();
      onClose();
    },
    onError: (error: any) => {
      toast.error("Failed to update user", {
        description: error.response?.data?.message || error.message,
      });
    },
  });

  const onSubmit = (values: FormData) => {
    if (!user?._id) return;

    // Filter out undefined values to send only updated fields
    const filteredDto: Partial<FormData> = Object.fromEntries(
      Object.entries(values).filter(([, value]) => value !== undefined && value !== "")
    );
    
    // Explicitly handle avatar removal by sending null if it was cleared
    if (avatarPreview === null && user.avatar !== null) {
      filteredDto.avatar = null;
    } else if (avatarFile && user.avatar === avatarPreview) {
      // If a new file is selected, but the preview is still the old avatar,
      // it means the user re-selected the same image or didn't change,
      // so we don't send `avatar` in the DTO unless it's a new file
      delete filteredDto.avatar;
    }

    updateUserMutation.mutate({
      userId: user._id,
      dto: filteredDto,
      avatarFile: avatarFile,
    });
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
      form.setValue("avatar", file.name); // Set a dummy value to trigger form dirty state
    }
  };

  const removeAvatar = () => {
    setAvatarFile(undefined);
    setAvatarPreview(null);
    form.setValue("avatar", null); // Explicitly set to null to indicate removal
  };

  const { isSubmitting } = form.formState;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Make changes to the user profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="flex items-center space-x-4 mb-4">
            <div className="relative">
              <Avatar className="h-20 w-20">
                <AvatarImage src={avatarPreview || "https://github.com/shadcn.png"} alt="@shadcn" />
                <AvatarFallback>{user?.first_name?.[0] || user?.email?.value?.[0] || "U"}</AvatarFallback>
              </Avatar>
              <Input
                id="avatar-upload"
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleAvatarChange}
                accept="image/*"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity rounded-full cursor-pointer">
                <CameraIcon className="h-6 w-6 text-white" />
              </div>
              {avatarPreview && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive/80 text-white hover:bg-destructive"
                  onClick={removeAvatar}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="avatar-upload">Change Avatar</Label>
              <p className="text-sm text-muted-foreground">Max 5MB (JPG, PNG, WEBP)</p>
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="first_name" className="text-right">
              First Name
            </Label>
            <Input
              id="first_name"
              {...form.register("first_name")}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="last_name" className="text-right">
              Last Name
            </Label>
            <Input
              id="last_name"
              {...form.register("last_name")}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">
              Role
            </Label>
            <Select
              onValueChange={(value) => form.setValue("role", value as UserRole)}
              value={form.watch("role")}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(UserRole).map((role) => (
                  <SelectItem key={role} value={role}>
                    {role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="lan" className="text-right">
              Language
            </Label>
            <Select
              onValueChange={(value) => form.setValue("lan", value)}
              value={form.watch("lan")}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="uz">Uzbek</SelectItem>
                <SelectItem value="ru">Russian</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone-value" className="text-right">
              Phone
            </Label>
            <Input
              id="phone-value"
              {...form.register("phone.value")}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone-verified" className="text-right">
              Phone Verified
            </Label>
            <Checkbox
              id="phone-verified"
              checked={form.watch("phone.isVerified")}
              onCheckedChange={(checked) => form.setValue("phone.isVerified", checked as boolean)}
              className="col-span-3 justify-self-start"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email-verified" className="text-right">
              Email Verified
            </Label>
            <Checkbox
              id="email-verified"
              checked={form.watch("email.isVerified")}
              onCheckedChange={(checked) => form.setValue("email.isVerified", checked as boolean)}
              className="col-span-3 justify-self-start"
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
