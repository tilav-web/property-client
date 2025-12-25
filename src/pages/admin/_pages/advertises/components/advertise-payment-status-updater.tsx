import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { paymentStatuses, type PaymentStatus } from "@/interfaces/advertise/advertise.interface";
import { adminAdvertiseService } from "../../../_services/admin-advertise.service";

interface AdvertisePaymentStatusUpdaterProps {
  id: string;
  currentPaymentStatus: PaymentStatus;
}

export const AdvertisePaymentStatusUpdater: React.FC<AdvertisePaymentStatusUpdaterProps> = ({
  id,
  currentPaymentStatus,
}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (newPaymentStatus: PaymentStatus) =>
      adminAdvertiseService.updateStatus(id, { paymentStatus: newPaymentStatus }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-advertises"] });
      toast.success("Advertise payment status updated successfully!");
    },
    onError: (error) => {
      toast.error(`Failed to update payment status: ${error.message}`);
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Badge variant="outline" className="cursor-pointer">{currentPaymentStatus}</Badge>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {paymentStatuses.map((p) => (
          <DropdownMenuItem
            key={p}
            onClick={() => mutation.mutate(p)}
            disabled={mutation.isPending || p === currentPaymentStatus}
          >
            {p}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
