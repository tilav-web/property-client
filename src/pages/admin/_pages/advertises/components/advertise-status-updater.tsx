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
import { advertiseStatuses, type AdvertiseStatus } from "@/interfaces/advertise/advertise.interface";
import { adminAdvertiseService } from "../../../_services/admin-advertise.service";

interface AdvertiseStatusUpdaterProps {
  id: string;
  currentStatus: AdvertiseStatus;
}

export const AdvertiseStatusUpdater: React.FC<AdvertiseStatusUpdaterProps> = ({
  id,
  currentStatus,
}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (newStatus: AdvertiseStatus) =>
      adminAdvertiseService.updateStatus(id, { status: newStatus }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-advertises"] });
      toast.success("Advertise status updated successfully!");
    },
    onError: (error) => {
      toast.error(`Failed to update status: ${error.message}`);
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Badge className="cursor-pointer">{currentStatus}</Badge>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {advertiseStatuses.map((s) => (
          <DropdownMenuItem
            key={s}
            onClick={() => mutation.mutate(s)}
            disabled={mutation.isPending || s === currentStatus}
          >
            {s}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
