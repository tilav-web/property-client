import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { adminService } from "../../_services/admin.service";
import { toast } from "sonner";
import { useState } from "react";

const passwordChangeSchema = z.object({
  oldPassword: z.string().min(1, "Old password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
});

type PasswordChangeForm = z.infer<typeof passwordChangeSchema>;

interface PasswordChangeDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PasswordChangeDialog({
  isOpen,
  onClose,
}: PasswordChangeDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PasswordChangeForm>({
    resolver: zodResolver(passwordChangeSchema),
  });

  const onSubmit = async (data: PasswordChangeForm) => {
    setIsSubmitting(true);
    try {
      await adminService.changePassword(data);
      toast.success("Password changed successfully!");
      reset();
      onClose();
    } catch (error) {
      console.error("Password change failed:", error);
      toast.error("Password change failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="oldPassword" className="text-right">
                Old Password
              </Label>
              <Input
                id="oldPassword"
                type="password"
                {...register("oldPassword")}
                className="col-span-3"
              />
              {errors.oldPassword && (
                <p className="col-span-4 text-red-500 text-xs">
                  {errors.oldPassword.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="newPassword" className="text-right">
                New Password
              </Label>
              <Input
                id="newPassword"
                type="password"
                {...register("newPassword")}
                className="col-span-3"
              />
              {errors.newPassword && (
                <p className="col-span-4 text-red-500 text-xs">
                  {errors.newPassword.message}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
